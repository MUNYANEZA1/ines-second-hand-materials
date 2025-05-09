// // src/components/common/Footer.jsx
// const Footer = () => {
//   return (
//     <footer className="bg-gray-800 text-white mt-auto py-6">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex flex-col md:flex-row justify-between items-center">
//           <div className="mb-4 md:mb-0">
//             <h2 className="text-lg font-semibold">
//               INES-Ruhengeri Marketplace
//             </h2>
//             <p className="text-sm text-gray-300">
//               Promoting sustainability through reusing and recycling
//             </p>
//           </div>
//           <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 text-sm">
//             <a href="#" className="hover:text-blue-300">
//               Terms of Service
//             </a>
//             <a href="#" className="hover:text-blue-300">
//               Privacy Policy
//             </a>
//             <a href="#" className="hover:text-blue-300">
//               Contact Us
//             </a>
//           </div>
//         </div>
//         <div className="mt-4 border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
//           &copy; {new Date().getFullYear()} INES-Ruhengeri. All rights reserved.
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;


// src/components/Footer.jsx
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              About INES Second-Hand
            </h3>
            <p className="text-gray-300">
              A platform for INES-Ruhengeri students and staff to buy, sell, and
              exchange second-hand items, promoting sustainability within our
              academic community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/items" className="text-gray-300 hover:text-white">
                  Browse Items
                </Link>
              </li>
              <li>
                <Link to="/add-item" className="text-gray-300 hover:text-white">
                  Sell Item
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="not-italic text-gray-300">
              <p>INES-Ruhengeri</p>
              <p>Musanze, Rwanda</p>
              <p className="mt-2">Email: info@ines.ac.rw</p>
              <p>Phone: +250 788 123 456</p>
            </address>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>
            &copy; {currentYear} INES-Ruhengeri Second-Hand Materials System.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;