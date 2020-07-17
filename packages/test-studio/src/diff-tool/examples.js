export const examples = {
  string: {
    title: 'String',
    fromValue: 'The quick brown fox jumps over the lazy dog.',
    toValue: 'The quick black Kokos jumps over the lazy Bamse.'
  },
  number: {
    title: 'Number',
    fromValue: 13,
    toValue: 37
  },
  boolean: {
    title: 'Boolean',
    fromValue: true,
    toValue: false
  },
  primitiveArray: {
    title: 'Primitive array',
    fromValue: ['js', 'php', 'go', 'erlang', 'clojure', 'java'],
    toValue: ['erlang', 'js', 'go', 'clojurescript', 'java']
  },
  keyedArray: {
    title: 'Keyed array',
    fromValue: [
      {_key: 'a', _type: 'experiment', title: 'Experiment A'},
      {_key: 'b', _type: 'experiment', title: 'Experiment B'},
      {_key: 'c', _type: 'experiment', title: 'Experiment C'},
      {_key: 'd', _type: 'experiment', title: 'Experiment D'}
    ],
    toValue: [
      {_key: 'd', _type: 'experiment', title: 'Experiment D'},
      {_key: 'a', _type: 'experiment', title: 'Experiment A'},
      {_key: 'x', _type: 'experiment', title: 'Experiment X'},
      {_key: 'c', _type: 'experiment', title: 'Experiment C'}
    ]
  },
  object: {
    title: 'Object',
    fromValue: {
      _type: 'diffTest',
      boolean: true,
      string: 'value',
      number: 1337,
      primitiveArray: ['js', 'php', 'go', 'erlang', 'clojure', 'java'],
      keyedArray: [
        {_key: 'a', _type: 'experiment', title: 'Experiment A'},
        {_key: 'b', _type: 'experiment', title: 'Experiment B'},
        {_key: 'c', _type: 'experiment', title: 'Experiment C'},
        {_key: 'd', _type: 'experiment', title: 'Experiment D'}
      ]
    },
    toValue: {
      _type: 'diffTest',
      boolean: false,
      string: 'new value',
      number: 1942,
      primitiveArray: ['erlang', 'js', 'go', 'clojurescript', 'java'],
      keyedArray: [
        {_key: 'd', _type: 'experiment', title: 'Experiment D'},
        {_key: 'a', _type: 'experiment', title: 'Experiment A'},
        {_key: 'x', _type: 'experiment', title: 'Experiment X'},
        {_key: 'c', _type: 'experiment', title: 'Experiment C'}
      ]
    }
  },
  image: {
    title: 'Image',
    fromValue: {
      _type: 'myImage',
      caption: 'Not a dog',
      asset: {
        _type: 'reference',
        _ref: 'image-857ab0e9de96c1c12feb2f92ad59602fdb5a50d4-3648x2736-jpg'
      }
    },
    toValue: {
      _type: 'myImage',
      caption: 'A dog',
      asset: {
        _type: 'reference',
        _ref: 'image-5eb3aeddb57e399e91cc40375617da12b07cd897-2736x3648-jpg'
      }
    }
  },
  file: {
    title: 'File',
    fromValue: {
      _type: 'namedFile',
      filename: 'tshirt.pdf',
      asset: {
        _type: 'reference',
        _ref: 'file-632eb264a795f1cf70eb91afa4d064f8e942685a-pdf'
      }
    },
    toValue: {
      _type: 'namedFile',
      filename: 'smaklig.pdf',
      asset: {
        _type: 'reference',
        _ref: 'file-4b1c5d972125d17684db119cb750ff3e852f2baf-pdf'
      }
    }
  },
  dateTime: {
    title: 'Date + time (custom)',
    schemaTypeName: 'customDateTime',
    fromValue: '2020-05-17T11:00:00.000Z',
    toValue: '2020-06-03T17:30:00.000Z'
  },
  date: {
    title: 'Date',
    schemaTypeName: 'date',
    fromValue: '2020-05-17',
    toValue: '2020-06-03'
  },
  slug: {
    title: 'Slug',
    fromValue: {_type: 'slug', current: 'foobar'},
    toValue: {_type: 'slug', current: 'foo-bar-baz'}
  },
  reference: {
    title: 'Reference',
    schemaTypeName: 'authorReference',
    fromValue: {_type: 'reference', _ref: 'grrm'},
    toValue: {_type: 'reference', _ref: 'foo-bar'}
  },
  portableText: {
    title: 'Portable text (basic)',
    fromValue: [
      {
        _type: 'block',
        _key: '49094ba1ee01',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: '49094ba1ee010',
            text: 'From this value',
            marks: []
          }
        ]
      }
    ],
    toValue: [
      {
        _type: 'block',
        _key: '49094ba1ee01',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: '49094ba1ee010',
            text: 'To ',
            marks: []
          },
          {
            _type: 'span',
            _key: '49094ba1ee011',
            text: 'that',
            marks: ['em']
          },
          {
            _type: 'span',
            _key: '49094ba1ee012',
            text: ' value',
            marks: []
          }
        ]
      }
    ]
  },
  portableTextLink: {
    title: 'Portable text (add link)',
    fromValue: [
      {
        _type: 'block',
        _key: '49094ba1ee01',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: '49094ba1ee010',
            text: 'VG once wrote an article',
            marks: []
          }
        ]
      }
    ],
    toValue: [
      {
        _type: 'block',
        _key: '49094ba1ee01',
        style: 'normal',
        markDefs: [{_key: 'abc123', _type: 'link', href: 'https://www.vg.no/'}],
        children: [
          {
            _type: 'span',
            _key: '49094ba1ee010',
            text: 'VG ',
            marks: ['abc123']
          },
          {
            _type: 'span',
            _key: '49094ba1ee011',
            text: ' once wrote an article',
            marks: []
          }
        ]
      }
    ]
  },
  portableTextHrefChange: {
    title: 'Portable text (link href change)',
    fromValue: [
      {
        _type: 'block',
        _key: '49094ba1ee01',
        style: 'normal',
        markDefs: [{_key: 'abc123', _type: 'link', href: 'http://www.vg.no/'}],
        children: [
          {
            _type: 'span',
            _key: '49094ba1ee010',
            text: 'VG ',
            marks: ['abc123']
          },
          {
            _type: 'span',
            _key: '49094ba1ee011',
            text: ' once wrote an article',
            marks: []
          }
        ]
      }
    ],
    toValue: [
      {
        _type: 'block',
        _key: '49094ba1ee01',
        style: 'normal',
        markDefs: [{_key: 'abc123', _type: 'link', href: 'https://www.vg.no/'}],
        children: [
          {
            _type: 'span',
            _key: '49094ba1ee010',
            text: 'VG ',
            marks: ['abc123']
          },
          {
            _type: 'span',
            _key: '49094ba1ee011',
            text: ' once wrote an article',
            marks: []
          }
        ]
      }
    ]
  },
  portableTextInline: {
    title: 'Portable text (inline object added)',
    fromValue: [
      {
        _type: 'block',
        _key: '34b1b4af3973',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: '34b1b4af39730',
            text:
              'The field stretched for miles, all beautiful, dark green for as long as the eye could see.',
            marks: []
          }
        ]
      }
    ],
    toValue: [
      {
        _type: 'block',
        _key: '34b1b4af3973',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'block',
            _key: '34b1b4af3973',
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: '34b1b4af39730',
                text: 'The field stretched for miles, all beautiful, ',
                marks: []
              },
              {
                _type: 'color',
                _key: '34b1b4af39731',
                alpha: 1,
                hex: '#2b6020',
                hsl: {
                  _type: 'hslaColor',
                  h: 109.2050209205021,
                  s: 0.5030813166992334,
                  l: 0.2494875,
                  a: 1
                },
                hsv: {
                  _type: 'hsvaColor',
                  h: 109.2050209205021,
                  s: 0.6694,
                  v: 0.375,
                  a: 1
                },
                rgb: {
                  _type: 'rgbaColor',
                  r: 43,
                  g: 96,
                  b: 32,
                  a: 1
                }
              },
              {
                _type: 'span',
                _key: '34b1b4af39732',
                text: ' for as long as the eye could see.',
                marks: []
              }
            ]
          }
        ]
      }
    ]
  },
  portableTextInlineChange: {
    title: 'Portable text (inline object change)',
    fromValue: [
      {
        _type: 'block',
        _key: '34b1b4af3973',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'block',
            _key: '34b1b4af3973',
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: '34b1b4af39730',
                text: 'The field stretched for miles, all beautiful, ',
                marks: []
              },
              {
                _type: 'color',
                _key: '34b1b4af39731',
                alpha: 1,
                hex: '#2b6020',
                hsl: {
                  _type: 'hslaColor',
                  h: 109.2050209205021,
                  s: 0.5030813166992334,
                  l: 0.2494875,
                  a: 1
                },
                hsv: {
                  _type: 'hsvaColor',
                  h: 109.2050209205021,
                  s: 0.6694,
                  v: 0.375,
                  a: 1
                },
                rgb: {
                  _type: 'rgbaColor',
                  r: 43,
                  g: 96,
                  b: 32,
                  a: 1
                }
              },
              {
                _type: 'span',
                _key: '34b1b4af39732',
                text: ' for as long as the eye could see.',
                marks: []
              }
            ]
          }
        ]
      }
    ],
    toValue: [
      {
        _key: '34b1b4af3973',
        _type: 'block',
        children: [
          {
            _key: '34b1b4af39730',
            _type: 'span',
            marks: [],
            text: 'The field stretched for miles, all beautiful, '
          },
          {
            _key: '34b1b4af39731',
            _type: 'color',
            alpha: 1,
            hex: '#602024',
            hsl: {
              _type: 'hslaColor',
              h: 355.4811715481172,
              s: 0.503,
              l: 0.2494,
              a: 1
            },
            hsv: {
              _type: 'hsvaColor',
              h: 355.4811715481172,
              s: 0.669328010645376,
              v: 0.3748482,
              a: 1
            },
            rgb: {
              _type: 'rgbaColor',
              r: 96,
              g: 32,
              b: 36,
              a: 1
            }
          },
          {
            _key: '34b1b4af39732',
            _type: 'span',
            marks: [],
            text: ' for as long as the eye could see.'
          }
        ],
        markDefs: [],
        style: 'normal'
      }
    ]
  }
}
