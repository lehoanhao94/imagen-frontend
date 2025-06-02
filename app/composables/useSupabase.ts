import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

export const useSupabaseClient = (): SupabaseClient => {
  if (!supabaseClient) {
    const runtimeConfig = useRuntimeConfig()

    // These would typically come from environment variables
    const supabaseUrl = runtimeConfig.public.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL
    const supabaseKey = runtimeConfig.public.SUPABASE_ANON_KEY || process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and anonymous key are required')
    }

    supabaseClient = createClient(supabaseUrl, supabaseKey)
  }

  return supabaseClient
}
