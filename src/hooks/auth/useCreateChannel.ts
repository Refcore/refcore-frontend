import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { RegisterChannelFormData } from '@/schema/register.schema';

type CreateChannelResponseData = {
  channel_id: string;
  owner_id: string;
  slug: string;
  whatsapp_verified: boolean;
  status: string;
};

type AppResponse<T> = {
  success: boolean;
  status_code: number;
  message: string;
  data: T | null;
  error_code?: string;
};

export const useCreateChannel = () => {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const createChannel = async (
    payload: RegisterChannelFormData,
  ): Promise<AppResponse<CreateChannelResponseData>> => {
    try {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        return {
          success: false,
          status_code: 401,
          message: 'You must be signed in to create a channel.',
          data: null,
          error_code: userError?.code,
        };
      }

      const { data, error } = await supabase
        .from('channels')
        .insert({
          owner_id: user.id,
          tv_name: payload.tv_name,
          slug: payload.slug,
          whatsapp_number: payload.whatsapp_number,
        })
        .select('id, owner_id, slug, whatsapp_verified, status')
        .single();

      if (error) {
        const duplicateField =
          error.message.toLowerCase().includes('slug')
            ? 'Slug already exists.'
            : error.message.toLowerCase().includes('whatsapp')
              ? 'WhatsApp number already exists.'
              : error.message;

        return {
          success: false,
          status_code: error.code === '23505' ? 409 : 400,
          message: duplicateField,
          data: null,
          error_code: error.code,
        };
      }

      return {
        success: true,
        status_code: 201,
        message: 'Channel created successfully.',
        data: {
          channel_id: data.id,
          owner_id: data.owner_id,
          slug: data.slug,
          whatsapp_verified: data.whatsapp_verified,
          status: data.status,
        },
      };
    } catch {
      return {
        success: false,
        status_code: 500,
        message: 'Something went wrong while creating the channel.',
        data: null,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createChannel,
  };
};