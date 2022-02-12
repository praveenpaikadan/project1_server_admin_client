import './failed-banner.css'

const FailedBanner  = ({message, position}) => (
    <div className="failed-banner">
        <div>{message}</div>
    </div>
)

export default FailedBanner;