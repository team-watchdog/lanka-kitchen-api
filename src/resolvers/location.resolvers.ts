import { Arg, Query, Resolver } from "type-graphql";
import axios, { Method} from "axios";

// types
import { Location } from "../types/location.types";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "";

@Resolver()
export class LocationResolver {
    private async geocode(searchTerm: string): Promise<Location[]> {
        var configPlaceSearch = {
            method: 'get' as Method,
            url: 'https://maps.googleapis.com/maps/api/geocode/json',
            headers: { },
            params: {
                address: searchTerm,
                key: GOOGLE_API_KEY,
            }
        };

        let place;

        try {
            const resp = await axios(configPlaceSearch);
            if (!resp.data || !resp.data.results || resp.data.results.length === 0) return [];

            return resp.data.results.map((place: any) => {
                let province;
                let district;

                if (place.address_components) {
                    // Province
                    let tmpProv = place.address_components.filter((comp: { [key: string]: string}) => {
                        if (comp.types.indexOf("administrative_area_level_1") > -1) return true;
                        return false;
                    });
        
                    if (tmpProv && tmpProv.length > 0) province = tmpProv[0].long_name;
        
                    // District
                    let tmpDist = place.address_components.filter((comp: { [key: string]: string}) => {
                        if (comp.types.indexOf("administrative_area_level_2") > -1) return true;
                        return false;
                    });
        
                    if (tmpDist && tmpDist.length > 0) district = tmpDist[0].long_name;
                };

                return {
                    placeId: place.place_id,
                    geo: {
                        lat: place.geometry.location.lat,
                        lon: place.geometry.location.lng,
                    },
                    formattedAddress: place.formatted_address,
                    district: district,
                    province: province,
                } as Location;
            });
        } catch (e) {
            return [];
        }
    }

    @Query(_ => [Location])
    async findAddresses(@Arg("searchTerm") searchTerm: string): Promise<Location[]> {
        const places = await this.geocode(searchTerm);
        return places;
    }
}