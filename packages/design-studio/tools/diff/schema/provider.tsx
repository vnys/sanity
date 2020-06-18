import React from 'react'

const SchemaContext = React.createContext<any>(null)

export function useSchemaType(name: string) {
  const schema = React.useContext(SchemaContext)

  console.log(schema, name)

  if (!schema) throw new Error('no schema in context')

  return schema.types.find(t => t.name === name)
}

export function SchemaProvider(props: any) {
  return <SchemaContext.Provider value={props.schema}>{props.children}</SchemaContext.Provider>
}
