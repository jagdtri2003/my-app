import React from 'react';

export default function Footer() {
  return (
    <div className="container mt-auto rounded ">
      <footer className="text-center text-lg-start text-white rounded" style={{ backgroundColor: '#45526e' }}>
        <div className="container pb-0">
            <hr />
          <section className="p-3 pt-0">
            <div className="row d-flex align-items-center">
              {/* Grid column */}
              <div className="col-md-7 col-lg-8 text-center text-md-start">
                {/* Copyright */}
                <div className="p-2" style={{ fontSize: "15px" }}>
                  Made with &hearts; by Jagdamba Tripathi
                </div>
              </div>
              <div className="col-md-5 col-lg-4 ml-lg-0 text-center text-md-end">
                <a className="btn btn-outline-light btn-floating m-1 text-white" role="button">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a className="btn btn-outline-light btn-floating m-1 text-white" role="button">
                  <i className="fab fa-twitter"></i>
                </a>
                <a className="btn btn-outline-light btn-floating m-1 text-white" role="button">
                  <i className="fab fa-google"></i>
                </a>
                <a className="btn btn-outline-light btn-floating m-1 text-white" role="button">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </section>
        </div>
      </footer>
    </div>
    );
  }