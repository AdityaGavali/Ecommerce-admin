import { BounceLoader, ClimbingBoxLoader , HashLoader} from "react-spinners";

export default function Spinner({size}){
    return (
        <HashLoader color={`orange`} speedMultiplier={2} size = {size} />
    )
}