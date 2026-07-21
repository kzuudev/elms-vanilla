
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {

    const navigate = useNavigate();

    return (
        <div>
            <h1>403 - Access Denied</h1>
            <p>You do not have the required permissions to view this page.</p>

            {/* send them back to the previous page */}
            <button onClick={() => navigate(-1)} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                Go Back
            </button>
        </div>
    )
}