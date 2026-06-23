-- =============================================
-- PÁNUCO MARKET - Setup Base de Datos
-- Pega esto en Supabase > SQL Editor > New query
-- =============================================

-- 1. Tabla de perfiles de usuario
create table if not exists public.perfiles (
  id uuid references auth.users on delete cascade primary key,
  nombre text not null,
  rol text not null default 'cliente' check (rol in ('cliente','vendedor_personal','local_negocio','servicio','admin')),
  aprobado boolean default false,
  whatsapp text,
  descripcion text,
  foto_perfil text,
  creado_en timestamp with time zone default now()
);

-- 2. Tabla de productos
create table if not exists public.productos (
  id uuid default gen_random_uuid() primary key,
  vendedor_id uuid references public.perfiles(id) on delete cascade not null,
  nombre text not null,
  descripcion text not null,
  precio numeric(10,2) not null,
  foto_url text,
  categoria text not null,
  cantidad_disponible integer,
  whatsapp_contacto text not null,
  estado text not null default 'activo' check (estado in ('activo','pausado')),
  creado_en timestamp with time zone default now()
);

-- 3. Tabla de favoritos
create table if not exists public.favoritos (
  id uuid default gen_random_uuid() primary key,
  usuario_id uuid references public.perfiles(id) on delete cascade,
  producto_id uuid references public.productos(id) on delete cascade,
  creado_en timestamp with time zone default now(),
  unique(usuario_id, producto_id)
);

-- 4. Storage bucket para fotos
insert into storage.buckets (id, name, public)
values ('fotos-productos', 'fotos-productos', true)
on conflict do nothing;

-- 5. Políticas de seguridad (RLS)
alter table public.perfiles enable row level security;
alter table public.productos enable row level security;
alter table public.favoritos enable row level security;

-- Perfiles: cualquiera puede leer, solo el dueño edita
create policy "Perfiles visibles para todos" on public.perfiles for select using (true);
create policy "Usuario edita su perfil" on public.perfiles for update using (auth.uid() = id);
create policy "Usuario crea su perfil" on public.perfiles for insert with check (auth.uid() = id);

-- Productos: todos ven activos, vendedor gestiona los suyos
create policy "Productos activos visibles" on public.productos for select using (estado = 'activo' or vendedor_id = auth.uid());
create policy "Vendedor crea productos" on public.productos for insert with check (auth.uid() = vendedor_id);
create policy "Vendedor edita sus productos" on public.productos for update using (auth.uid() = vendedor_id);
create policy "Vendedor elimina sus productos" on public.productos for delete using (auth.uid() = vendedor_id);

-- Favoritos: cada quien ve y gestiona los suyos
create policy "Ver mis favoritos" on public.favoritos for select using (auth.uid() = usuario_id);
create policy "Agregar favorito" on public.favoritos for insert with check (auth.uid() = usuario_id);
create policy "Eliminar favorito" on public.favoritos for delete using (auth.uid() = usuario_id);

-- Storage: todos ven fotos, usuarios autenticados suben
create policy "Fotos publicas" on storage.objects for select using (bucket_id = 'fotos-productos');
create policy "Subir fotos" on storage.objects for insert with check (bucket_id = 'fotos-productos' and auth.role() = 'authenticated');
create policy "Eliminar fotos propias" on storage.objects for delete using (bucket_id = 'fotos-productos' and auth.uid()::text = (storage.foldername(name))[1]);

-- 6. Trigger: crear perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.perfiles (id, nombre, rol)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1)),
    'cliente'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 7. Admin por defecto (cambia el email por el tuyo)
-- Después de registrarte, corre esto para hacerte admin:
-- update public.perfiles set rol = 'admin', aprobado = true where id = auth.uid();

