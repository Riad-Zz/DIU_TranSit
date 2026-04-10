import { FaLinkedinIn } from "react-icons/fa";
import { CiFacebook } from "react-icons/ci";
import { FaInstagram } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="w-full border-t bg-[#111111] border-gray-800 text-gray-300">

            <div className="text-center max-w-7xl mx-auto px-6 py-10 
                            grid grid-cols-1 sm:grid-cols-2
                            lg:grid-cols-4 gap-8 lg:text-left">

                {/* Transport */}
                <nav>
                    <h6 className="footer-title mb-3 text-white">Transport</h6>
                    <ul className="space-y-2">
                        <li><a className="link link-hover">Routes</a></li>
                        <li><a className="link link-hover">Schedule</a></li>
                        <li><a className="link link-hover">Tracking</a></li>
                        <li><a className="link link-hover">Fare</a></li>
                    </ul>
                </nav>

                {/* Company */}
                <nav>
                    <h6 className="footer-title mb-3 text-white">Company</h6>
                    <ul className="space-y-2">
                        <li><a className="link link-hover">About Us</a></li>
                        <li><a className="link link-hover">Contact</a></li>
                        <li><a className="link link-hover">Careers</a></li>
                    </ul>
                </nav>

                {/* Legal */}
                <nav>
                    <h6 className="footer-title mb-3 text-white">Legal</h6>
                    <ul className="space-y-2">
                        <li><a className="link link-hover">Terms & Conditions</a></li>
                        <li><a className="link link-hover">Privacy Policy</a></li>
                        <li><a className="link link-hover">Support</a></li>
                    </ul>
                </nav>

                {/* Social */}
                <nav>
                    <h6 className="footer-title mb-3 text-white">Follow Us</h6>
                    <ul className="space-y-2 flex align-center gap-4 justify-center lg:justify-start">
                        <li><a className="link link-hover"><FaLinkedinIn className="text-2xl" /></a></li>
                        <li><a className="link link-hover"><CiFacebook className="text-2xl" /></a></li>
                        <li><a className="link link-hover"><FaInstagram className="text-2xl" /></a></li>
                        <li><a className="link link-hover"><FaGithub className="text-2xl" /></a></li>
                        
                    </ul>
                </nav>

            </div>

            <div className="border-t border-gray-800"></div>

        {/* Bottom Section */}
            <div className="max-w-7xl mx-auto px-6 py-4
                            flex flex-col sm:flex-row items-center justify-between text-sm text-gray-400">

                <p className="text-center sm:text-left">
                    © 2026 Transport Company. All rights reserved.
                </p>

                <div className="flex gap-4 mt-2 sm:mt-0">
                    <a className="link link-hover">Terms</a>
                    <a className="link link-hover">Privacy</a>
                    <a className="link link-hover">Cookies</a>
                </div>
            </div>

        </footer>
    );
};

export default Footer;