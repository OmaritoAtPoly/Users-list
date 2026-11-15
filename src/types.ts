// Domain models shared by the API layer, hooks and components.
// Deliberately trimmed to the fields the app uses, not a 1:1 mirror
// of the JSONPlaceholder payload.

export interface User {
  id: number
  name: string
  username: string
  email: string
  company: {
    name: string
  }
}

export interface Post {
  userId: number
  id: number
  title: string
  body: string
}

export interface NewPost {
  userId: number
  title: string
  body: string
}
