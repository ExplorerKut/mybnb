import BingMapsReact from "bingmaps-react"

export default function ShowMaps(props){
    return (
        <div className="map-container">
        <BingMapsReact
      bingMapsKey="Anx97pqS4pTHqxYaUYjD290YWkXQPn0jbgwBP7EP4P1N1cOfYx4B1QDjhYSHd7hx"
      height="100%"
      mapOptions={{
        navigationBarMode: "square",
      }}
      width="100%"
      viewOptions={{
        center: { latitude: 42.360081, longitude: -71.058884 },
        mapTypeId: "grayscale",
      }}
    />
    </div>
    )
}