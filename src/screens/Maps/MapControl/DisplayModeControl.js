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
          <div class="font-medium mb-1">Display Mode:</div>
          <div class="flex flex-col space-y-1">
            <label class="flex items-center cursor-pointer">
              <input type="radio" name="display-mode" value="hybrid" ${displayMode === 'hybrid' ? 'checked' : ''} class="mr-1 cursor-pointer" />
              <span>Both</span>
            </label>
            <label class="flex items-center cursor-pointer">
              <input type="radio" name="display-mode" value="heat" ${displayMode === 'heat' ? 'checked' : ''} class="mr-1 cursor-pointer" />
              <span>Heatmap</span>
            </label>
            <label class="flex items-center cursor-pointer">
              <input type="radio" name="display-mode" value="cluster" ${displayMode === 'cluster' ? 'checked' : ''} class="mr-1 cursor-pointer" />
              <span>Clusters</span>
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
      
      return div;
    };
    
    displayControl.addTo(map);
    
    return () => {
      displayControl.remove();
    };
  }, [map, displayMode, setDisplayMode]);
  
  return null;
};