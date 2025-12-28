
export const setTabCount = (tab, count) => ({
  type: 'SET_TAB_COUNT',
  payload: { tab, count },
});

export const setAllTabCounts = (counts) => ({
  type: 'SET_ALL_TAB_COUNTS',
  payload: counts,
});
