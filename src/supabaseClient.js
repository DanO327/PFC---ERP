import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vhjpvoihguparblikxcl.supabase.co';
const supabaseKey = 'sb_publishable_aBQAQsdjWuRebnjO58O_aw_SyVxHyJW';

export const supabase = createClient(supabaseUrl, supabaseKey);
