export const mockSessions = Array.from({ length: 57 }).map((_, index) => ({
  id: index + 1,
  plateNumber: `12الف${index + 10}-45`,
  phoneNumber: `09${Math.floor(100000000 + Math.random() * 900000000)}`,
  entryTime: "1404/11/12 - 10:30",
  exitTime: "1404/11/12 - 12:45",
  cost: (index + 1) * 5000,
}));