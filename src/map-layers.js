export const clusterLayer = {
  id: 'clusters',
  type: 'circle',
  source: 'stores',
  filter: ['has', 'point_count'],
  paint: {
    'circle-stroke-width': 5,
    'circle-stroke-color': [
      'step',
      ['get', 'point_count'],
      '#FBB13B',
      6,
      '#8E8698',
      12,
      '#407D7E',
    ],
    'circle-color': [
      'step',
      ['get', 'point_count'],
      '#eefef6',
      6,
      '#FFEC62',
      12,
      '#B4D9D9',
    ],
    'circle-radius': ['step', ['get', 'point_count'], 20, 6, 30, 12, 40],
  },
};

export const clusterCountLayer = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'stores',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 14,
  },
  paint: {
    'text-color': '#4F4A57',
  },
};

export const unclusteredPointLayer = {
  id: 'unclustered-point',
  type: 'symbol',
  source: 'stores',
  filter: ['!', ['has', 'point_count']],
  layout: {
    'icon-image': 'logo',
    'icon-anchor': 'top',
    'icon-size': 0.25,
  },
};
