import {
  Avatar,
  IconAppearance,
  IconBell,
  IconFile,
  IconLanguage,
  IconLogOut,
  IconUser,
  MenuItem,
  MenuSection,
  Popover,
  ThemeSwitch,
} from '../../design-system';

/**
 * Menú de configuración. En esta demo solo el modo claro/oscuro es interactivo;
 * el resto muestra la estructura prevista, atenuada y fuera del orden de tabulación.
 */
export function SettingsMenu({open, anchor, boundary, theme, onToggleTheme, onClose}) {
  return (
    <Popover open={open} anchor={anchor} boundary={boundary} placement="right-end" label="Configuración" onClose={onClose}>
      <div className="olb-settings">
        <div className="olb-settings__profile">
          <Avatar name="Equipo Comercial" size={40} />
          <div>
            <strong>Equipo comercial</strong>
            <span>Administrador · Olibia</span>
          </div>
        </div>
        <MenuSection title="Cuenta">
          <MenuItem icon={IconUser} label="Datos de usuario" disabled />
          <MenuItem icon={IconBell} label="Notificaciones" value="Activadas" disabled />
        </MenuSection>
        <MenuSection title="Preferencias">
          <MenuItem icon={IconAppearance} label="Modo oscuro" control={<ThemeSwitch theme={theme} onToggle={onToggleTheme} />} />
          <MenuItem icon={IconFile} label="Tipo de archivo de descarga" value="CSV" disabled />
          <MenuItem icon={IconLanguage} label="Idioma" value="Español" disabled />
        </MenuSection>
        <MenuSection>
          <MenuItem icon={IconLogOut} label="Cerrar sesión" tone="danger" disabled />
        </MenuSection>
        <p className="olb-settings__note">En esta demo solo el modo de color está disponible.</p>
      </div>
    </Popover>
  );
}
