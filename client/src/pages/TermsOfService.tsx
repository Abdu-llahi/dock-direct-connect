import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Terms of Service</h1>
                <p className="text-slate-600">Last updated: December 2024</p>
              </div>
            </div>
            <div className="text-xl font-bold text-blue-600">🚚 DockDirect</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="prose prose-slate max-w-none">
            
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using DockDirect ("Service"), you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              DockDirect is a digital logistics platform that connects shippers and drivers for freight transportation services. 
              Our platform facilitates:
            </p>
            <ul>
              <li>Load posting and bidding</li>
              <li>Real-time shipment tracking</li>
              <li>Document management</li>
              <li>Payment processing facilitation</li>
              <li>User verification and rating systems</li>
            </ul>

            <h2>3. User Accounts and Verification</h2>
            <h3>3.1 Account Registration</h3>
            <p>
              To use DockDirect, you must create an account and provide accurate, complete information. 
              You are responsible for maintaining the confidentiality of your account credentials.
            </p>
            
            <h3>3.2 Verification Requirements</h3>
            <p>Commercial users must provide:</p>
            <ul>
              <li>Valid business license or operating authority</li>
              <li>Insurance documentation</li>
              <li>DOT/MC numbers (where applicable)</li>
              <li>Identity verification documents</li>
            </ul>

            <h2>4. User Responsibilities</h2>
            <h3>4.1 Shippers</h3>
            <ul>
              <li>Provide accurate load information</li>
              <li>Ensure cargo is properly packaged and documented</li>
              <li>Comply with all applicable shipping regulations</li>
              <li>Pay agreed-upon rates in a timely manner</li>
            </ul>

            <h3>4.2 Drivers/Carriers</h3>
            <ul>
              <li>Maintain valid commercial driving licenses</li>
              <li>Ensure vehicle safety and compliance</li>
              <li>Transport goods safely and timely</li>
              <li>Provide accurate delivery confirmations</li>
            </ul>

            <h2>5. Prohibited Activities</h2>
            <p>Users are prohibited from:</p>
            <ul>
              <li>Posting false or misleading information</li>
              <li>Attempting to circumvent platform fees</li>
              <li>Harassing or threatening other users</li>
              <li>Violating any applicable laws or regulations</li>
              <li>Using the platform for illegal or unauthorized purposes</li>
            </ul>

            <h2>6. Payment Terms</h2>
            <h3>6.1 Platform Fees</h3>
            <p>
              DockDirect charges service fees as outlined in your subscription plan. 
              Fees are subject to change with 30 days notice.
            </p>

            <h3>6.2 Payment Processing</h3>
            <p>
              While DockDirect facilitates connections, payment arrangements are between shippers and carriers. 
              DockDirect may offer optional payment processing services subject to additional terms.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              DockDirect serves as a platform to connect parties and is not responsible for:
            </p>
            <ul>
              <li>The performance of transportation services</li>
              <li>Loss or damage to cargo</li>
              <li>Disputes between users</li>
              <li>Third-party actions or omissions</li>
            </ul>

            <h2>8. Insurance and Risk</h2>
            <p>
              All users are responsible for maintaining appropriate insurance coverage. 
              DockDirect strongly recommends cargo insurance for all shipments.
            </p>

            <h2>9. Data Privacy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy to understand 
              how we collect, use, and protect your information.
            </p>

            <h2>10. Dispute Resolution</h2>
            <p>
              Disputes between users should first be resolved directly. DockDirect may provide 
              mediation services but is not obligated to resolve user disputes.
            </p>

            <h2>11. Termination</h2>
            <p>
              DockDirect reserves the right to suspend or terminate accounts for violations of these terms. 
              Users may terminate their accounts at any time with proper notice.
            </p>

            <h2>12. Changes to Terms</h2>
            <p>
              DockDirect reserves the right to modify these terms at any time. 
              Users will be notified of significant changes and continued use constitutes acceptance.
            </p>

            <h2>13. Governing Law</h2>
            <p>
              These terms are governed by the laws of [Jurisdiction] and any disputes will be 
              resolved in the courts of [Jurisdiction].
            </p>

            <h2>14. Contact Information</h2>
            <p>
              For questions about these Terms of Service, contact us at:
            </p>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="mb-2"><strong>DockDirect Legal Team</strong></p>
              <p>Email: legal@dockdirect.com</p>
              <p>Phone: 1-800-DOCK-DIRECT</p>
              <p>Address: [Company Address]</p>
            </div>

            <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 font-medium">
                🔒 By using DockDirect, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;