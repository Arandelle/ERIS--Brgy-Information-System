import { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
export const YearSelectorControl = ({ selectedYear, setSelectedYear, availableYears }) => {
  const map = useMap();
  
  useEffect(() => {
    if (availableYears.length === 0) return;
    
    const yearControl = L.control({ position: 'topleft' });
    
    yearControl.onAdd = function() {
      const div = L.DomUtil.create('div', 'year-selector-control');
      div.innerHTML = `
        <select class="leaflet-bar p-2 border rounded cursor-pointer bg-white shadow-md">
          ${availableYears.map(year => 
            `<option value="${year}" ${year === selectedYear ? 'selected' : ''}>${year}</option>`
          ).join('')}
        </select>
      `;
      
      const select = div.querySelector('select');
      
      L.DomEvent.on(select, 'change', function(e) {
        setSelectedYear(Number(e.target.value));
      });
      
      // Prevent map zoom when scrolling over the select
      L.DomEvent.disableClickPropagation(div);
      L.DomEvent.disableScrollPropagation(div);
      
      return div;
    };
    
    yearControl.addTo(map);
    
    return () => {
      yearControl.remove();
    };
  }, [map, selectedYear, setSelectedYear, availableYears]);
  
  return null;
};