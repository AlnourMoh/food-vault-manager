
create or replace function public.request_password_reset(p_email varchar)
returns void
language plpgsql
security definer
as $$
begin
  -- Check if the email exists in restaurant_access
  if not exists (select 1 from restaurant_access where email = p_email) then
    raise exception 'البريد الإلكتروني غير مسجل في النظام';
  end if;

  -- Create a notification for the restaurant admin
  insert into notifications (
    title,
    message,
    type,
    user_id
  )
  select
    'طلب استعادة كلمة المرور',
    'تم تقديم طلب استعادة كلمة المرور للبريد الإلكتروني: ' || p_email,
    'password_reset_request',
    user_id
  from companies c
  join restaurant_access ra on ra.restaurant_id = c.id
  where ra.email = p_email;
end;
$$;
