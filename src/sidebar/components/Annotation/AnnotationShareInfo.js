import { SvgIcon } from '@hypothesis/frontend-shared';
import { withServices } from '../../service-context';

import { useStoreProxy } from '../../store/use-store';
import { isPrivate } from '../../helpers/permissions';

/**
 * @typedef {import("../../../types/api").Annotation} Annotation
 * @typedef {import('../../../types/api').Group} Group
 * @typedef {import('../../../types/config').MergedConfig} MergedConfig
 */

/**
 * @typedef AnnotationShareInfoProps
 * @prop {Annotation} annotation
 * @prop {MergedConfig} settings - Injected
 */

const groupLink = (group, settings) => {
  if (group && group?.links.html) {
    if (!settings.groupnameUrl) {
      return group.links.html;
    }
    else {
      return `${settings.groupnameUrl}${group.name}`
    }
  }

  return undefined;
};


/**
 * Render information about what group an annotation is in and
 * whether it is private to the current user (only me)
 *
 * @param {AnnotationShareInfoProps} props
 */
function AnnotationShareInfo({
 annotation,
 settings
}) {
  const store = useStoreProxy();
  const group = store.getGroup(annotation.group);

  // Only show the name of the group and link to it if there is a
  // URL (link) returned by the API for this group. Some groups do not have links
  // If there is a settings override `groupnameUrl`, append groupname to this link.
  const linkToGroup = groupLink(group, settings);

  const annotationIsPrivate = isPrivate(annotation.permissions);

  return (
    <div className="AnnotationShareInfo u-layout-row--align-baseline">
      {group && linkToGroup && (
        <a
          className="u-layout-row--align-baseline u-color-text--muted"
          href={linkToGroup}
          target="_blank"
          rel="noopener noreferrer"
        >
          {group.type === 'open' ? (
            <SvgIcon className="AnnotationShareInfo__icon" name="public" />
          ) : (
            <SvgIcon className="AnnotationShareInfo__icon" name="groups" />
          )}
          <span className="AnnotationShareInfo__group-info">{group.name}</span>
        </a>
      )}
      {annotationIsPrivate && !linkToGroup && (
        <span className="u-layout-row--align-baseline u-color-text--muted">
          <span className="AnnotationShareInfo__private-info">Only me</span>
        </span>
      )}
    </div>
  );
}

export default withServices(AnnotationShareInfo, ['settings']);
