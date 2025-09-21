export const WelcometoSite = () => {
    return (
        <div className=" p-5 mb-4 bg-dark header" style={{marginTop:"45px"}}>
            <div className="container-fluid py-3 text-white d-flex justify-content-center align-items-center">
                <div>
                    <h1 className="display-5 fw-bold">Welcome to SkillSync</h1>
                    <p className="col-md-8 fs-4">Tell our Freelancers whats on your mind. They will do it for you</p>
                    {/* <a className="btn main-color btn-lg text-white rounded-pill" type="button" href="#">Post your Project</a>                                */}
                </div>
            </div>
        </div>
    );
}