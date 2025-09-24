import PublicNoticesModel from "../../../../Model/publicNoticesModel";
import { SafeText, sanitizeURL } from '../../../../utils/XSSProtection';

export const SearchBook: React.FC<{ notice: PublicNoticesModel, key: number }> = (props) => {
    return (
        <div className='container d-flex justify-content-center '>
            <div className="card mt-5" style={{ width: "80%" }}>
                <div className="card-body">
                    <div className="text-left"> {/* Wrapper for text and button */}
                        <SafeText text={props.notice.title} className="card-title" tag="h4" />
                        <SafeText text={props.notice.description} className="card-text" tag="p" />
                        {props.notice.moreDetailsLink !== null && props.notice.moreDetailsLink !== "" ?
                            <p>
                                for more details visit: <a href={sanitizeURL(props.notice.moreDetailsLink)} rel="noopener noreferrer" target="_blank">
                                    <SafeText text={props.notice.moreDetailsLink} tag="span" />
                                </a>
                            </p> :
                            ""
                        }
                    </div>
                    <h6></h6>
                </div>
                <div className="d-flex justify-content-center">
                    {props.notice.imagelink && (
                        <img className="card-img-bottom"
                            src={sanitizeURL(props.notice.imagelink)}
                            alt="Notice image"
                            style={{ width: "80%", height: "90%" }}
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }} />
                    )}
                </div>
            </div>

        </div>
    );
}