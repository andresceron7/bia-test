import {Popover} from './Popover';
import {Avatar} from './Feedback';
import {Badge} from './Badge';
import {IconCheck} from '../icons';

/**
 * Selector de perfil anclado al módulo de usuario.
 * profiles: [{id, label, name, detail, task}] — `task` se muestra en un chip translúcido.
 */
export function ProfileMenu({open, anchor, boundary, placement = 'bottom-end', profiles, currentId, onSelect, onClose}) {
  return (
    <Popover open={open} anchor={anchor} boundary={boundary} placement={placement} label="Cambiar de perfil" onClose={onClose}>
      <div className="ds-profile-menu">
        <span className="ds-eyebrow ds-profile-menu__title">Cambiar de perfil</span>
        <ul>
          {profiles.map(profile => {
            const current = profile.id === currentId;
            return (
              <li key={profile.id}>
                <button
                  type="button"
                  className="ds-profile-option"
                  aria-current={current ? 'true' : undefined}
                  data-autofocus={current || undefined}
                  onClick={() => (current ? onClose() : onSelect(profile))}
                >
                  <Avatar name={profile.name} size={40} />
                  <span className="ds-profile-option__text">
                    <span className="ds-profile-option__label">
                      {profile.label}
                      <Badge tone="glass">{profile.task}</Badge>
                    </span>
                    <span className="ds-profile-option__detail">
                      {profile.name} · {profile.detail}
                    </span>
                  </span>
                  <span className="ds-profile-option__check" aria-hidden="true">
                    {current && <IconCheck size={20} strokeWidth={2} />}
                  </span>
                  {current && <span className="sr-only">(perfil actual)</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </Popover>
  );
}
