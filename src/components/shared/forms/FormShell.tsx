'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactNode } from 'react';
import type { DefaultValues, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

type FormShellProps<TSchema extends z.ZodObject<z.ZodRawShape>> = {
  schema: TSchema;
  defaultValues: DefaultValues<z.infer<TSchema>>;
  onSubmit: SubmitHandler<z.infer<TSchema>>;
  children:
    | ReactNode
    | ((form: UseFormReturn<z.infer<TSchema>>) => ReactNode);
  className?: string;
  id?: string;
};

const FormShell = <TSchema extends z.ZodObject<z.ZodRawShape>>({
  schema,
  defaultValues,
  onSubmit,
  children,
  className,
  id,
}: FormShellProps<TSchema>) => {
  const form = useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema) as never,
    defaultValues,
    mode: 'onChange',
  });

  return (
    <FormProvider {...form}>
      <form
        id={id}
        onSubmit={form.handleSubmit(onSubmit)}
        className={className}
        noValidate
      >
        {typeof children === 'function' ? children(form) : children}
      </form>
    </FormProvider>
  );
};

export default FormShell;