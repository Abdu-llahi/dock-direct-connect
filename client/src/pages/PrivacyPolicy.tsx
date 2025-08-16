import { ArrowLeft, Shield, Eye, Database, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PrivacyPolicy = () => {
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
                <h1 className="text-2xl font-bold text-slate-900">Privacy Policy</h1>
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
          
          {/* Privacy Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900">Data Protection</h3>
              <p className="text-sm text-slate-600">Enterprise-grade security for your information</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <Eye className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900">Transparency</h3>
              <p className="text-sm text-slate-600">Clear information about data usage</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <Database className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900">Data Control</h3>
              <p className="text-sm text-slate-600">You control your personal information</p>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <Lock className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900">Secure Storage</h3>
              <p className="text-sm text-slate-600">Encrypted data storage and transmission</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            
            <h2>1. Introduction</h2>
            <p>
              DockDirect ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains 
              how we collect, use, disclose, and safeguard your information when you use our logistics platform.
            </p>

            <h2>2. Information We Collect</h2>
            
            <h3>2.1 Personal Information</h3>
            <p>We collect information you provide directly to us, including:</p>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, phone number, business information</li>
              <li><strong>Business Verification:</strong> DOT/MC numbers, business licenses, insurance documents</li>
              <li><strong>Profile Information:</strong> Company details, preferences, profile photos</li>
              <li><strong>Payment Information:</strong> Billing addresses and payment method details (processed by secure third-party providers)</li>
            </ul>

            <h3>2.2 Operational Data</h3>
            <ul>
              <li><strong>Load Information:</strong> Shipment details, pickup/delivery locations, cargo descriptions</li>
              <li><strong>Location Data:</strong> GPS coordinates during active shipments (with explicit consent)</li>
              <li><strong>Communication:</strong> Messages, notifications, and support interactions</li>
              <li><strong>Transaction Data:</strong> Bids, agreements, and service history</li>
            </ul>

            <h3>2.3 Technical Information</h3>
            <ul>
              <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
              <li><strong>Usage Data:</strong> Platform interaction patterns, feature usage, session duration</li>
              <li><strong>Cookies:</strong> Session management, preferences, and analytics data</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            
            <h3>3.1 Service Provision</h3>
            <ul>
              <li>Facilitate connections between shippers and carriers</li>
              <li>Process and manage shipments</li>
              <li>Verify user credentials and maintain platform security</li>
              <li>Provide customer support and resolve disputes</li>
            </ul>

            <h3>3.2 Platform Improvement</h3>
            <ul>
              <li>Analyze usage patterns to improve our services</li>
              <li>Develop new features and functionality</li>
              <li>Ensure platform security and prevent fraud</li>
              <li>Conduct research and analytics</li>
            </ul>

            <h3>3.3 Communication</h3>
            <ul>
              <li>Send service-related notifications and updates</li>
              <li>Provide marketing communications (with your consent)</li>
              <li>Share important platform announcements</li>
              <li>Respond to inquiries and support requests</li>
            </ul>

            <h2>4. Information Sharing</h2>
            
            <h3>4.1 Between Platform Users</h3>
            <p>
              To facilitate logistics services, we share necessary information between shippers and carriers, including:
            </p>
            <ul>
              <li>Contact information for coordinating shipments</li>
              <li>Business credentials and ratings</li>
              <li>Load details and location information</li>
              <li>Performance history and reviews</li>
            </ul>

            <h3>4.2 Service Providers</h3>
            <p>We may share information with trusted third-party providers for:</p>
            <ul>
              <li>Payment processing and financial services</li>
              <li>Background check and verification services</li>
              <li>Email and communication services</li>
              <li>Analytics and platform optimization</li>
            </ul>

            <h3>4.3 Legal Requirements</h3>
            <p>We may disclose information when required by law or to:</p>
            <ul>
              <li>Comply with legal processes and government requests</li>
              <li>Protect our rights, property, or safety</li>
              <li>Investigate potential violations of our terms</li>
              <li>Prevent fraud or security threats</li>
            </ul>

            <h2>5. Data Security</h2>
            
            <h3>5.1 Security Measures</h3>
            <p>We implement industry-standard security measures including:</p>
            <ul>
              <li><strong>Encryption:</strong> SSL/TLS encryption for all data transmission</li>
              <li><strong>Access Controls:</strong> Role-based access and multi-factor authentication</li>
              <li><strong>Monitoring:</strong> 24/7 security monitoring and threat detection</li>
              <li><strong>Regular Audits:</strong> Security assessments and penetration testing</li>
            </ul>

            <h3>5.2 Data Storage</h3>
            <p>
              Your data is stored on secure servers with enterprise-grade protection. 
              We maintain backups and implement disaster recovery procedures to ensure data availability.
            </p>

            <h2>6. Your Privacy Rights</h2>
            
            <h3>6.1 Access and Control</h3>
            <p>You have the right to:</p>
            <ul>
              <li>Access and review your personal information</li>
              <li>Update or correct inaccurate data</li>
              <li>Delete your account and associated data</li>
              <li>Export your data in a portable format</li>
            </ul>

            <h3>6.2 Communication Preferences</h3>
            <ul>
              <li>Opt out of marketing communications</li>
              <li>Customize notification preferences</li>
              <li>Control location sharing settings</li>
              <li>Manage cookie preferences</li>
            </ul>

            <h2>7. Data Retention</h2>
            <p>
              We retain your information for as long as necessary to provide our services and comply with legal obligations. 
              Specific retention periods include:
            </p>
            <ul>
              <li><strong>Account Data:</strong> Until account deletion plus 30 days</li>
              <li><strong>Transaction Records:</strong> 7 years for business and legal purposes</li>
              <li><strong>Communication Logs:</strong> 2 years for support and dispute resolution</li>
              <li><strong>Analytics Data:</strong> Aggregated and anonymized data may be retained indefinitely</li>
            </ul>

            <h2>8. Children's Privacy</h2>
            <p>
              DockDirect is not intended for use by individuals under 18 years of age. 
              We do not knowingly collect personal information from children under 18.
            </p>

            <h2>9. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place for international data transfers.
            </p>

            <h2>10. Cookie Policy</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Maintain your login session</li>
              <li>Remember your preferences</li>
              <li>Analyze platform usage</li>
              <li>Provide personalized experiences</li>
            </ul>
            <p>You can manage cookie preferences through your browser settings.</p>

            <h2>11. Updates to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. We will notify you of significant changes 
              through email or platform notifications. Your continued use constitutes acceptance of the updated policy.
            </p>

            <h2>12. Contact Us</h2>
            <p>
              For questions about this Privacy Policy or to exercise your privacy rights, contact us at:
            </p>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="mb-2"><strong>DockDirect Privacy Team</strong></p>
              <p>Email: privacy@dockdirect.com</p>
              <p>Phone: 1-800-DOCK-PRIVACY</p>
              <p>Address: [Privacy Officer Address]</p>
            </div>

            <div className="mt-12 p-6 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">
                🔐 Your privacy is our priority. We are committed to transparent data practices 
                and protecting your personal information with enterprise-grade security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;