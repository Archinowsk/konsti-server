/* @flow */

export type Group = {|
  +id: string, // Group id
  +size: number, // Group size
  +pref: $ReadOnlyArray<string>, // Game wishes (game id)
|}

export type Event = {|
  +id: string, // game id
  +min: number, // game min players
  +max: number, // game max players
  +groups: $ReadOnlyArray<Group>, // groups signed for the game
|}

export type ListItem = {|
  +id: number, // group id
  +size: number, // group size
  +event: number, // game id for the signed game
  +gain: number, // preference: 1st choice => 1, 2nd choice => 0.5, 3rd choice => 0.33
|}

export type Input = {|
  +groups: $ReadOnlyArray<Group>,
  +events: $ReadOnlyArray<Event>,
  +list: $ReadOnlyArray<ListItem>,
  +updateL: Function,
|}

export type OpaAssignResult = {|
  +id: string,
  +assignment: string,
|}

export type OpaAssignResults = $ReadOnlyArray<OpaAssignResult>
