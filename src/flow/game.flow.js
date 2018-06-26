// @flow
export type Game = {
  id: number,
  title: string,
  description: string,
  notes: string,
  location: string,
  date: Date,
  time: string,
  mins: number,
  tags: Array<string>,
  people: Array<string>,
  minAttendance: number,
  maxAttendance: number,
  attributes: Array<string>,
  table: string,
  created: Date,
}
