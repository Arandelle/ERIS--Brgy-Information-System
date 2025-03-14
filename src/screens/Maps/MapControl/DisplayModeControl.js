import { useEffect } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';

// Display mode control as a separate control component
export const DisplayModeControl = ({ displayMode, setDisplayMode }) => {
  const map = useMap();
  
  useEffect(() => {
    const displayControl = L.control({ position: 'topright' });
    
    displayControl.onAdd = function() {
      const div = L.DomUtil.create('div', 'display-control');
      div.innerHTML = `
        <div class="leaflet-bar bg-white p-2 rounded shadow-md cursor-pointer">
          <div class="font-bold p-1 mb-1">Display Mode:</div>
          <div class="flex flex-col space-y-1">
            <label class="flex items-center cursor-pointer space-x-1">
              <input type="radio" name="display-mode" value="heat" ${displayMode === 'heat' ? 'checked' : ''} class="mr-1 cursor-pointer" />
              <span>Heatmap</span>
            </label>
            <label class="flex items-center cursor-pointer space-x-1">
              <input type="radio" name="display-mode" value="cluster" ${displayMode === 'cluster' ? 'checked' : ''} class="mr-1 cursor-pointer" />
              <span>Clusters</span>
            </label>
            <label class="flex items-center cursor-pointer space-x-1">
              <input type="radio" name="display-mode" value="marker" ${displayMode === 'marker' ? 'checked' : ''} class="mr-1 cursor-pointer" />
            <p class="flex flex-col">
                <span>Marker</span>
            </p>
            </label>
          </div>
        </div>
      `;
      
      // Add event listeners with a slight delay to ensure DOM is ready
      setTimeout(() => {
        const radios = div.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
          L.DomEvent.on(radio, 'change', function(e) {
            setDisplayMode(e.target.value);
          });
          L.DomEvent.disableClickPropagation(radio);
        });
      }, 100);
      
      L.DomEvent.disableClickPropagation(div);
      L.DomEvent.disableScrollPropagation(div)
      return div;
    };
    
    displayControl.addTo(map);
    
    return () => {
      displayControl.remove();
    };
  }, [map, displayMode, setDisplayMode]);
  
  return null;
};