
const Footer = () => {
  const date = new Date();
  const year = date.getFullYear();

  return (
    <footer id="footer" className="bg-white text-black bottom-0 ">
      {/* Footer Links */}

      {/* Footer Credits */}
      <div className="footer-credits relative z-10">
        <div className="wrap wrap-px py-6">
          <p className="my-0">
            © {year} Anirudh Kadian. All rights reserved{"  "}
          </p>
        </div>
      </div>
      <div className="footer--background"></div>
    </footer>
  );
};

export default Footer;
