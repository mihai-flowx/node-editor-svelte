export const nodes = [
  {
    id: 1,
    name: 'start',
    outputSockets: [{ id: 2, name: '' }],
  },
  {
    id: 2,
    name: 'send_kafka_request',
    inputSockets: [{ id: 3, name: '' }],
    outputSockets: [{ id: 4, name: '' }],
  },
  {
    id: 3,
    name: 'receive_kafka_request',
    inputSockets: [{ id: 5, name: '' }],
    outputSockets: [{ id: 6, name: '' }],
  },
  {
    id: 4,
    name: 'show_search_results',
    inputSockets: [{ id: 7, name: '' }],
    outputSockets: [{ id: 8, name: '' }],
  },
  {
    id: 5,
    name: 'end',
    inputSockets: [{ id: 9, name: '' }],
  },
]

export const edges = [
  {
    id: 1,
    source: {
      nodeId: 1,
      socketId: 2,
    },
    target: {
      nodeId: 2,
      socketId: 3,
    },
  },
  {
    id: 2,
    source: {
      nodeId: 2,
      socketId: 4,
    },
    target: {
      nodeId: 3,
      socketId: 5,
    },
  },
  {
    id: 3,
    source: {
      nodeId: 3,
      socketId: 6,
    },
    target: {
      nodeId: 4,
      socketId: 7,
    },
  },
  {
    id: 4,
    source: {
      nodeId: 4,
      socketId: 8,
    },
    target: {
      nodeId: 5,
      socketId: 9,
    },
  },
]
