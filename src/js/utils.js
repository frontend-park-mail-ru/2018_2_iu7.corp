export function getEventTarget(target) {
    if (!(target instanceof HTMLAnchorElement)) {
        target = target.closest("a");

        if (!target) {
            return null;
        }
    }

    return target;
}