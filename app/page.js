import HomeBanner from "./components/HomeBanner.jsx";

import Footer from "./components/Footer.jsx";


// import ContentImage from "./components/ContentImage.jsx";
export default function Home() {


  return (
    <>
      <div className="main-wrapper bg-[#F3F5F8] relative z-10 pt-20 ">
        {/* Page Banner  */}
        <HomeBanner />

      </div>

      <Footer />
    </>
  );
}
