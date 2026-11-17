export interface Profile {
  id: string
  full_name: string
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface UserPreferences {
  id: string
  user_id: string
  language: string
  theme: 'light' | 'dark' | 'system'
  created_at: string
  updated_at: string
}
