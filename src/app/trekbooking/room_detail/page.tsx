/* eslint-disable @next/next/no-img-element */
const room_detail = () => {
    return (
      <>
        <div className="container">
          <span className="font-semibold text-xl" style={{ color: "#305A61" }}>
            Home <span>/</span> <span>Hotels</span> <span>/</span>{" "}
            <span>Cereja Hotel & Resort Dalat</span> <span>/</span>{" "}
            <span>Deluxe Double Or Twin Garden View</span>
          </span>
        </div>
        <div
          className="container border my-20"
          style={{
            // height: "790px",
            borderRadius: "20px",
            boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div className="py-8 px-3">
            <div className="row">
              <div className="col-md-8">
                <p className="font-semibold text-3xl">
                  Deluxe Double Or Twin Garden View
                </p>
                <div className="flex items-center justify-between w-2/5">
                  <div>
                    <span
                      className="p-0 text-base font-normal"
                      style={{ color: "#305A61" }}
                    >
                      Room
                    </span>
                  </div>
                  <div className="flex h-3">
                    <img className="pr-1" src="/image/start.png" alt="" />
                    <img className="pr-1" src="/image/start.png" alt="" />
                    <img className="pr-1" src="/image/start.png" alt="" />
                    <img className="pr-1" src="/image/start.png" alt="" />
                    <img className="pr-1" src="/image/start.png" alt="" />
                  </div>
                  <div>
                    <img src="/image/map-pin.png" alt="" />
                  </div>
                  <div>
                    <span className="text-base font-normal">Ward 3, Da Lat</span>
                  </div>
                </div>
                <p className="text-base font-normal">
                  Located in the area of the DaLat Pine Hill , by the romantic
                  lake Tuyen Lam
                </p>
              </div>
  
              <div className="col-md-4 grid justify-items-center content-center">
                <div>
                  <span>Price/room/night starts from</span>
                </div>
                <span className="font-bold text-2xl">35US$</span>
                <a
                  className="no-underline px-4 py-1 border text-base font-medium text-white"
                  style={{ borderRadius: "12px", backgroundColor: "#305A61" }}
                  href=""
                >
                  Select room
                </a>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <img className="w-full" src="/image/bed_breakfast.png" alt="" />
              </div>
              <div className="col-md-6 grid content-between">
                <div>
                  <img className="w-full" src="/image/sink_toilet.png" alt="" />
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <img className="w-full" src="/image/room1.png" alt="" />
                  </div>
                  <div className="col-md-6">
                    <img className="w-full" src="/image/room2.png" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  export default room_detail;
  