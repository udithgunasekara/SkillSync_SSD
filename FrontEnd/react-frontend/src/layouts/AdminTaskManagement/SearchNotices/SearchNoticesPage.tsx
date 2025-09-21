import { useEffect, useState } from "react";
import PublicNoticesModel from "../../../Model/publicNoticesModel";
import { SpinnerLoading } from "../../../utils/SpinnerLoading";
import axios from "axios";
import { SearchBook } from "./Components/SearchNotices";
import { Cardcontent } from "../Dashboard/Components/card";

export const SearchNoticesPage = () => {

    const [data, setData] = useState<PublicNoticesModel[]>([]);
    const [error, setError] = useState(null);
    const [isloading, setIsloading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchurl, setSearchurl] = useState('');
    const [totalNumberOfElements, setTotalNumberOfElements] = useState(0);
    let response;
    let url: string = '';

    useEffect(() => {
        const fetchData = async () => {

            if (searchurl === '') {
                url = `http://localhost:8082/notices/search?title=&description=&`;
            } else {
                url = searchurl;
            }


            try {
                response = await axios.get(url);
            } catch (error) {
                throw new Error("Error in fetching data");
            }

            const responsedata = response.data.content;
            setTotalNumberOfElements(response.data.numberOfElements)
            console.log(response.data.numberOfElements);

            const loadedNotices: PublicNoticesModel[] = [];
            for (const element in responsedata) {
                loadedNotices.push({
                    id: responsedata[element].id,
                    title: responsedata[element].title,
                    description: responsedata[element].description,
                    audience: responsedata[element].audience,
                    datecreated: responsedata[element].datecreated,
                    lastupdated: responsedata[element].lastupdated,
                    moreDetailsLink: responsedata[element].moreDetailsLink,
                    imagelink: responsedata[element].imagelink
                });
            }

            setData(loadedNotices);
            setIsloading(false);
        };

        fetchData().catch(
            (error) => {
                setError(error.message)
            }
        )
    }, [searchTerm, searchurl]);

    if (isloading) {
        return (
            <SpinnerLoading />
        );
    }
    if (error) {
        return (
            <div className="container m-5">
                <p>{error}</p>
            </div>
        );
    }

    const searchHandleChange = () => {
        setCurrentPage(1);
        console.log("search term is: " + searchTerm);
        if (searchTerm === '') {

            setSearchurl('');
        } else {
            setSearchurl(`http://localhost:8082/notices/search?title=${searchTerm}&description=${searchTerm}`);
        }
    };

    const serachTermHandler = (props: any) => {
        console.log("search term is: " + props);
        const sanitizedInput = props.replace(/[^a-zA-Z0-9\s]/g, '');
        console.log("sanitized input is: " + sanitizedInput);
        if (sanitizedInput === '') {
            setSearchTerm('errorsearchterm');
        } else {
            setSearchTerm(sanitizedInput);
        }
    }



    return (
        <div className="container below-navbar">
            <div className="container pt-3">
                <div className="row mt-5">
                    <div className="col-6">
                        <div className="d-flex">
                            <input className="form-control me-2" type="search" placeholder="search using keywords in title or description" aria-label="search"
                                onChange={e => serachTermHandler(e.target.value)}
                            />
                            <button className="btn btn-success"
                                onClick={() => searchHandleChange()}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="mt-3">
                        <h5>Number of Results:({totalNumberOfElements})</h5>
                    </div>
                    {data.slice().reverse().map(element => (
                        <Cardcontent notice={element} key={element.id} />
                        // <SearchBook notice={element} key={element.id} />
                    ))}

                </div>
            </div>

        </div>
    );
}