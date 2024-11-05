function Footer() {
  return (
    <div className="footer">
      <div className="section-padding">
        <div class="flex-container"><br/><br/>
          <div class="flex-item-left">
            <h4>Dini M</h4>
            <br />
            <p>
              This website is for <br /> educational purpose
            </p>
          </div>
          <div class="flex-item-middle">
            <h4>Socials</h4>
            <br />
            <p>
              <a href="/#">LinkedIn</a>
            </p>
            <p>
              <a href="/#">Medium</a>
            </p>
            <p>
              <a href="/#">Github</a>
            </p>
          </div>
          <div class="flex-item-right">
            <h4>Resouces</h4>
            <br />
            <p>
              <a href="/#">APIs</a>
            </p>
            <p>
              <a href="/#">Images</a>
            </p>
          </div>
        </div>
        <div className="footer-below">
          <div className="footer-copyright">
            <p>@{new Date().getFullYear()} Dini Mustika. All right reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
