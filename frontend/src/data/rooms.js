export const rooms = [
  { id: 'R-101', number: '101', floor: 1, type: 'Single', status: 'Occupied', capacity: 1, occupied: 1, rent: 8500 },
  { id: 'R-102', number: '102', floor: 1, type: 'Double', status: 'Occupied', capacity: 2, occupied: 2, rent: 6500 },
  { id: 'R-103', number: '103', floor: 1, type: 'Double', status: 'Vacant', capacity: 2, occupied: 0, rent: 6500 },
  { id: 'R-104', number: '104', floor: 1, type: 'Triple', status: 'Occupied', capacity: 3, occupied: 2, rent: 5200 },
  { id: 'R-105', number: '105', floor: 1, type: 'Single', status: 'Maintenance', capacity: 1, occupied: 0, rent: 8500 },
  { id: 'R-201', number: '201', floor: 2, type: 'Single', status: 'Occupied', capacity: 1, occupied: 1, rent: 9000 },
  { id: 'R-202', number: '202', floor: 2, type: 'Double', status: 'Occupied', capacity: 2, occupied: 1, rent: 6800 },
  { id: 'R-203', number: '203', floor: 2, type: 'Double', status: 'Vacant', capacity: 2, occupied: 0, rent: 6800 },
  { id: 'R-204', number: '204', floor: 2, type: 'Triple', status: 'Occupied', capacity: 3, occupied: 3, rent: 5400 },
  { id: 'R-205', number: '205', floor: 2, type: 'Single', status: 'Occupied', capacity: 1, occupied: 1, rent: 9000 },
  { id: 'R-301', number: '301', floor: 3, type: 'Double', status: 'Vacant', capacity: 2, occupied: 0, rent: 7000 },
  { id: 'R-302', number: '302', floor: 3, type: 'Single', status: 'Occupied', capacity: 1, occupied: 1, rent: 9200 },
]

export const floors = [1, 2, 3]
export const roomStatuses = ['Occupied', 'Vacant', 'Maintenance']
