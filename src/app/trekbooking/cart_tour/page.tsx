/* eslint-disable @next/next/no-img-element */
const cart_tour = () => {
    return (
      <div className="container py-8">
        <div>
          <a
            className="no-underline flex items-center font-medium text-xl"
            style={{ color: "#305A61" }}
            href="#"
          >
            <img src="/image/chevron-down.png" alt="" /> Back
          </a>
        </div>
        <div className="flex my-8">
          <div className="pr-5">
            <a
              className="no-underline px-4 py-2 border text-sm font-medium listA"
              href="#"
              style={{ borderRadius: "10px" }}
            >
              Cart Tours
            </a>
          </div>
          <div className="">
            <a
              className="no-underline px-4 py-2 border text-sm font-medium listA"
              href="#"
              style={{ borderRadius: "10px" }}
            >
              Booking Cart
            </a>
          </div>
        </div>
  
        <div className="row ">
          <div className="col-lg-8 col-md-12">
            <div
              className="border "
              style={{ borderRadius: "10px", boxShadow: "0 6px 4px 0 #7F7F7F" }}
            >
              <div className="px-10 pt-7 pb-12">
                <div className="row border-solid border-b-2 border-black pb-3">
                  <div className="col-md-7">
                    <span
                      className="font-bold text-lg"
                      style={{ color: "#305A61" }}
                    >
                      Tours
                    </span>
                  </div>
                  <div className="col-md-5 row">
                    <div className="col-md-4 text-center">
                      <span
                        className="font-bold text-lg"
                        style={{ color: "#305A61" }}
                      >
                        Quantity
                      </span>
                    </div>
                    <div className="col-md-4 text-center">
                      <span
                        className="font-bold text-lg"
                        style={{ color: "#305A61" }}
                      >
                        Total
                      </span>
                    </div>
                    <div className="col-md-4"></div>
                  </div>
                </div>
                <div className="row pt-10">
                  <div className="col-md-7 flex justify-evenly items-center">
                    <div className="">
                      <img
                        className="border"
                        style={{ borderRadius: "10px" }}
                        src="/image/tour1.png"
                        alt=""
                      />
                    </div>
                    <div className="w-2/5">
                      <span className="font-semibold text-base">
                        Phu Quoc coral diving tour Explore colorful islands
                      </span>
                    </div>
                  </div>
                  <div className="col-md-5 row ">
                    <div className="col-md-4 flex items-center content-center justify-evenly">
                      <button>+</button>
                      <div>
                        <span>01</span>
                      </div>
                      <button>-</button>
                    </div>
                    <div className="col-md-4 flex items-center content-center justify-evenly">
                      <span className="font-bold text-xl">15US$</span>
                    </div>
                    <div className="col-md-4 flex items-center content-center justify-evenly">
                      <a href="#">
                        <img src="/image/trash.png" alt="" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="row pt-10">
                  <div className="col-md-7 flex justify-evenly items-center">
                    <div className="">
                      <img
                        className="border"
                        style={{ borderRadius: "10px" }}
                        src="/image/tour1.png"
                        alt=""
                      />
                    </div>
                    <div className="w-2/5">
                      <span className="font-semibold text-base">
                        Phu Quoc coral diving tour Explore colorful islands
                      </span>
                    </div>
                  </div>
                  <div className="col-md-5 row ">
                    <div className="col-md-4 flex items-center content-center justify-evenly">
                      <button>+</button>
                      <div>
                        <span>01</span>
                      </div>
                      <button>-</button>
                    </div>
                    <div className="col-md-4 flex items-center content-center justify-evenly">
                      <span className="font-bold text-xl">15US$</span>
                    </div>
                    <div className="col-md-4 flex items-center content-center justify-evenly">
                      <a href="#">
                        <img src="/image/trash.png" alt="" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-12">
            <div
              className="border"
              style={{ borderRadius: "10px", boxShadow: "0 6px 4px 0 #7F7F7F" }}
            >
              <div className="w-3/5 m-auto">
                <div className="text-center pt-3">
                  <span
                    className=" text-xl font-semibold"
                    style={{ color: "#305A61" }}
                  >
                    Price Details
                  </span>
                </div>
                <div className="pt-4 pb-8">
                  <div className="flex justify-between">
                    <p className="font-semibold text-lg">Sub - total: </p>
                    <p className="text-2xl">15US$</p>
                  </div>
                  <div className="flex justify-between border-solid border-b-2 border-black">
                    <p className="font-semibold text-lg">Discount:</p>
                    <p className="text-2xl">
                      <span className="text-2xl">-</span> 5US$
                    </p>
                  </div>
                  <div className="flex justify-between pt-2">
                    <p className="font-semibold text-lg">Total</p>
                    <p className="text-2xl font-semibold">10US$</p>
                  </div>
                  <div className="flex justify-end">
                    <button
                      className=" text-white font-medium py-1 px-3 text-lg border"
                      style={{ backgroundColor: "#305A61", borderRadius: "20px" }}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
  
            <div
              className="border mt-3"
              style={{ borderRadius: "10px", boxShadow: "0 6px 4px 0 #7F7F7F" }}
            >
              <div className="row justify-evenly items-center px-2 py-2">
                <div className="col-lg-8">
                  <input
                    className="pl-3 border"
                    style={{ borderRadius: "10px" }}
                    type="text"
                    placeholder="Discount vouchers"
                  />
                </div>
                <div className="col-lg-4">
                  <button
                    className="text-white font-medium py-1 px-3 text-base border"
                    style={{ backgroundColor: "#305A61", borderRadius: "20px" }}
                  >
                    Applied
                  </button>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  export default cart_tour;
  