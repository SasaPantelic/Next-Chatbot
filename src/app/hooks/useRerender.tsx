import React, { useState, useCallback } from 'react';

export function useRerender() {
    const [, updateState] = useState<object>();
    const forceUpdate = useCallback(() => updateState({}), []);
    return forceUpdate
}