import React from 'react';
import { Link } from 'react-router';
// Assuming a custom Button component is available with size and variant props
// If not, replace with a standard <button> element and apply Tailwind classes directly.
const Button = ({ children, size, variant, className, onClick, to }) => {
    const baseClasses = "font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95";
    let sizeClasses = "";
    let variantClasses = "";

    switch (size) {
        case "lg":
            sizeClasses = "px-8 py-3 text-lg";
            break;
        case "default":
        default:
            sizeClasses = "px-6 py-2 text-base";
            break;
    }

    switch (variant) {
        case "outline":
            variantClasses = "border border-blue-600 text-blue-600 hover:bg-blue-50";
            break;
        case "default":
        default:
            variantClasses = "bg-blue-600 text-white hover:bg-blue-700";
            break;
    }

    if (to) {
        return (
            <Link to={to} className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}>
                {children}
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}>
            {children}
        </button>
    );
};


const features = [
    {
        title: "Digital Signature",
        desc: "Securely sign documents with your digital signature directly on the PDF. Fast, easy, and legally binding.",
        icon: "✍️", // Pen emoji
    },
    {
        title: "Text & Image Editing",
        desc: "Add, edit, and move text anywhere on your PDF. Insert images and adjust their size and position.",
        icon: "✏️", // Pencil emoji
    },
    {
        title: "Cloud Storage (AWS S3)",
        desc: "All your edited PDFs are safely stored in your personal cloud storage on AWS S3 for easy access anytime, anywhere.",
        icon: "☁️", // Cloud emoji
    },
    {
        title: "Document History",
        desc: "Keep track of all your saved documents with a comprehensive history page. Revisit or re-download old versions.",
        icon: "📚", // Books/Archive emoji
    },
    {
        title: "Responsive Design",
        desc: "Access and edit your documents seamlessly from any device – desktop, tablet, or mobile – with an optimized interface.",
        icon: "📱", // Mobile phone emoji
    },
    {
        title: "Secure & Private",
        desc: "Your documents and data are protected with industry-standard security measures, ensuring privacy and compliance.",
        icon: "🔒", // Lock emoji
    },
];

const testimonials = [
    {
        name: "Sarah Chen",
        role: "Legal Consultant",
        text: "Signing contracts used to be a headache. This PDF editor's digital signature feature has streamlined my workflow, saving me hours every week!",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
        name: "Mark Johnson",
        role: "Small Business Owner",
        text: "The ability to quickly edit PDFs and then automatically save them to S3 is a game-changer. It's incredibly reliable and easy to use.",
        avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    },
    {
        name: "Emily White",
        role: "Remote Educator",
        text: "I can easily mark up student assignments and sign consent forms on the go. The responsiveness across devices is fantastic!",
        avatar: "https://randomuser.me/api/portraits/women/21.jpg",
    },
];

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex flex-col font-inter">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row items-center justify-between px-8 py-16 max-w-6xl mx-auto w-full">
                <div className="flex-1 flex flex-col items-start gap-6 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                        Sign, Edit, & Manage Your <span className="text-blue-600">PDFs</span>
                        <br />With Ease, Anywhere, Anytime.
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto md:mx-0">
                        Our intuitive PDF editor empowers you to digitally sign documents, add text,
                        make edits, and securely store them in the cloud. Streamline your paperwork
                        and boost productivity.
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 w-full">
                        <Button size="lg" to="/sign-in" className="min-w-[150px]">
                            Sign In
                        </Button>
                        <Button size="lg" variant="outline" to="/sign-up" className="min-w-[150px]">
                            Get Started
                        </Button>
                    </div>
                </div>
                {/* // animation links
                
                // - https://assets10.lottiefiles.com/packages/lf20_kyu7xb1v.json
                // - https://assets1.lottiefiles.com/packages/lf20_2kscui.json
                // - https://assets2.lottiefiles.com/packages/lf20_1pxqjqps.json
                // - https://assets4.lottiefiles.com/packages/lf20_3vbOcw.json
                // - https://assets9.lottiefiles.com/packages/lf20_3rwasyjy.json */}
                {/* Lottie Animation (Placeholder, replace with relevant animation) */}
                <div className="flex-1 flex justify-center items-center mt-10 md:mt-0">
                    <lottie-player
                        src="https://assets10.lottiefiles.com/packages/lf20_kyu7xb1v.json" // Placeholder for document/signing animation
                        background="transparent"
                        speed="1"
                        style={{ width: "400px", height: "400px" }}
                        loop
                        autoplay
                    ></lottie-player>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-white py-12">
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">
                        Why Choose Our <span className="text-blue-600">PDF Editor</span>?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="flex flex-col items-center text-center gap-4 bg-blue-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="text-5xl mb-2">{feature.icon}</div>
                                <h3 className="text-xl font-semibold text-blue-700">{feature.title}</h3>
                                <p className="text-gray-600 text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Use Cases / Digital Signing Highlight */}
            <div className="bg-indigo-50 py-12">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-8">
                        Key Use Case: <span className="text-blue-600">Digitally Sign Any Document</span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8">
                        Experience the power of paperless workflows. Our editor allows you to easily add your signature to contracts, forms, and agreements with just a few clicks. Secure, convenient, and legally valid.
                    </p>
                    {/* <div className="flex justify-center items-center py-6">
                        <img
                            src="https://placehold.co/600x350/E0F2FE/3B82F6?text=Digital+Signature+Demo" // Placeholder image for digital signature process
                            alt="Digital Signature Workflow"
                            className="rounded-xl shadow-xl border border-blue-200"
                        />
                    </div> */}
                </div>
            </div>

            {/* How It Works Section */}
            <div className="bg-white py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-8">
                        How It Works
                    </h2>
                    <ol className="space-y-6 text-lg text-gray-700 list-decimal list-inside">
                        <li className="p-4 bg-blue-50 rounded-lg shadow-sm">
                            <span className="font-semibold text-blue-600">1. Upload Your PDF:</span> Easily drag & drop or select your document from your device.
                        </li>
                        <li className="p-4 bg-blue-50 rounded-lg shadow-sm">
                            <span className="font-semibold text-blue-600">2. Add Content:</span> Digitally sign, type text, or place images precisely where you need them.
                        </li>
                        <li className="p-4 bg-blue-50 rounded-lg shadow-sm">
                            <span className="font-semibold text-blue-600">3. Preview & Refine:</span> Instantly see your changes and adjust elements until perfect.
                        </li>
                        <li className="p-4 bg-blue-50 rounded-lg shadow-sm">
                            <span className="font-semibold text-blue-600">4. Download & Save:</span> Download the modified PDF and automatically save it to your secure cloud history.
                        </li>
                    </ol>
                </div>
            </div>

            {/* Trusted By Section - Renamed to "Our Technology Partners" or "Powered By" */}
            <div className="bg-white py-10">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Powered by Reliable Technologies</h3>
                    <div className="flex flex-wrap justify-center gap-8 opacity-80">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" alt="AWS" className="h-10" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" alt="Node.js" className="h-8" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React" className="h-8" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" alt="Tailwind CSS" className="h-8" />
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="bg-indigo-50 py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-8">
                        What Our Users Say
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((t) => (
                            <div key={t.name} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300">
                                <img src={t.avatar} alt={t.name} className="w-20 h-20 rounded-full mb-4 object-cover border-4 border-indigo-200" />
                                <p className="text-gray-700 mb-3 text-base italic">"{t.text}"</p>
                                <div className="font-bold text-indigo-700">{t.name}</div>
                                <div className="text-sm text-gray-500">{t.role}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-12">
                <div className="max-w-2xl mx-auto text-center px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Transform Your Document Workflow?
                    </h2>
                    <p className="text-lg text-blue-100 mb-6">
                        Start editing, signing, and managing your PDFs digitally today!
                    </p>
                    <Button size="lg" to="/sign-up" className=" text-blue-700 font-bold px-10 py-3 text-lg shadow-lg hover:bg-blue-50">
                        Get Started for Free
                    </Button>
                </div>
            </div>

            {/* Footer */}
            <footer className="text-center text-gray-400 py-6 text-sm">
                &copy;{new Date().getFullYear()} Your PDF Editor. All rights reserved.
            </footer>
        </div>
    );
};

export default LandingPage;
