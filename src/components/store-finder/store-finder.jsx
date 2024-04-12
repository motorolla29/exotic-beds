import { useState } from 'react';
import Map from 'react-map-gl/maplibre';

import 'maplibre-gl/dist/maplibre-gl.css';
import './store-finder.sass';

const StoreFinder = () => {
  return (
    <div className="store-finder">
      <div className="store-finder_header">
        <h1 className="store-finder_header_title">Find our Exotic store</h1>
        <p className="store-finder_header_subtitle">
          We have more than 100 stores around the world, find the nearest one
          and come visit
        </p>
        <div className="store-finder_header_finder">find</div>
      </div>
      <div className="store-finder_locator">
        <div className="store-finder_locator_list">
          <div className="store-finder_locator_list_header">
            <p className="store-finder_locator_list_header_counter">
              10 Stores Near You
            </p>
          </div>
          <div className="store-info-items">
            <div className="store-info-item">item</div>
            <div className="store-info-item">item</div>
            <div className="store-info-item">item</div>
            <div className="store-info-item">item</div>
            <div className="store-info-item">item</div>
            <div className="store-info-item">item</div>
            <div className="store-info-item">item</div>
            <div className="store-info-item">item</div>
            <div className="store-info-item">item</div>
            <div className="store-info-item">item</div>
            <div className="store-info-item">item</div>
          </div>
        </div>
        <div className="store-finder_locator_map">
          <Map
            initialViewState={{
              longitude: -122.4,
              latitude: 37.8,
              zoom: 14,
            }}
            mapStyle={
              'https://api.maptiler.com/maps/streets/style.json?key=JiORwzpLecOFb1wih0mU'
            }
          />
        </div>
      </div>
    </div>
  );
};

export default StoreFinder;
