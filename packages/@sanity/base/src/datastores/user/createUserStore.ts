/* eslint-disable @typescript-eslint/no-use-before-define */
import {Observable, of, from} from 'rxjs'
import raf from 'raf'
import DataLoader from 'dataloader'
import pubsub from 'nano-pubsub'
import authenticationFetcher from 'part:@sanity/base/authentication-fetcher'
import client from 'part:@sanity/base/client'
import createActions from '../utils/createActions'

const userCache: Record<string, User | null> = {}

const userChannel = pubsub()
const errorChannel = pubsub()

let _initialFetched = false
let _currentUser = null
let _currentError = null

userChannel.subscribe((val: CurrentUser | null) => {
  _currentUser = val

  if (val) {
    const normalized = normalizeOwnUser(val)
    userCache.me = normalized
    userCache[val.id] = normalized
  }
})

errorChannel.subscribe(val => {
  _currentError = val
})

export interface CurrentUser {
  id: string
  name: string
  profileImage?: string
  role: string
}

export interface CurrentUserError {
  type: 'error'
  error: Error
}

export interface CurrentUserSnapshot {
  type: 'snapshot'
  user: CurrentUser
}

export type CurrentUserEvent = CurrentUserError | CurrentUserSnapshot

export interface User {
  id: string
  displayName?: string
  imageUrl?: string
}

function fetchInitial() {
  return authenticationFetcher.getCurrentUser().then(
    user => userChannel.publish(user),
    err => errorChannel.publish(err)
  )
}

function logout() {
  return authenticationFetcher.logout().then(
    () => userChannel.publish(null),
    err => errorChannel.publish(err)
  )
}

const currentUser = new Observable<CurrentUserEvent>(observer => {
  if (_initialFetched) {
    const emitter = _currentError ? emitError : emitSnapshot
    emitter(_currentError || _currentUser)
  } else {
    _initialFetched = true
    fetchInitial()
  }

  const unsubUser = userChannel.subscribe(nextUser => emitSnapshot(nextUser))
  const unsubError = errorChannel.subscribe(err => emitError(err))
  const unsubscribe = () => {
    unsubUser()
    unsubError()
  }

  return unsubscribe

  function emitError(error) {
    observer.next({type: 'error', error})
  }

  function emitSnapshot(user) {
    observer.next({type: 'snapshot', user})
  }
})

const userLoader = new DataLoader(loadUsers, {
  batchScheduleFn: cb => raf(cb)
})

async function loadUsers(userIds: readonly string[]): Promise<(User | null)[]> {
  const missingIds = userIds.filter(userId => !(userId in userCache))
  let users = []
  if (missingIds.length > 0) {
    users = await client
      .request({
        uri: `/users/${missingIds.join(',')}`,
        withCredentials: true
      })
      .then(arrayify)

    users.forEach(user => {
      userCache[user.id] = user
    })
  }

  return userIds.map(userId => {
    // Try cache first
    if (userCache[userId]) {
      return userCache[userId]
    }

    // Look up from returned users
    return users.find(user => user.id === userId) || null
  })
}

function getUser(userId: string): Promise<User | null> {
  return userLoader.load(userId)
}

async function getUsers(ids: string[]): Promise<User[]> {
  const users = await userLoader.loadMany(ids)
  return users.filter((user): user is User => user && !(user instanceof Error))
}

function arrayify(users: User | User[]): User[] {
  return Array.isArray(users) ? users : [users]
}

function normalizeOwnUser(user: CurrentUser): User {
  return {
    id: user.id,
    displayName: user.name,
    imageUrl: user.profileImage
  }
}

const observableApi = {
  currentUser,

  getUser: (userId: string): Observable<User | null> =>
    typeof userCache[userId] === 'undefined' ? from(getUser(userId)) : of(userCache[userId]),

  getUsers: (userIds: string[]): Observable<User[]> => {
    const missingIds = userIds.filter(userId => !(userId in userCache))
    return missingIds.length === 0
      ? of(userIds.map(userId => userCache[userId]).filter(Boolean))
      : from(getUsers(userIds))
  }
}

export default function createUserStore() {
  return {
    actions: createActions({logout, retry: fetchInitial}),
    currentUser,
    getUser,
    getUsers,
    observable: observableApi
  }
}
