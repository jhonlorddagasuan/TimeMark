'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  HelpCircle, 
  Search, 
  Book, 
  MessageCircle, 
  Mail, 
  FileText,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export function Help() {
  const [searchTerm, setSearchTerm] = useState('');

  const faqItems = [
    {
      question: 'How do I mark attendance?',
      answer: 'Go to the Dashboard or Attendance Logs page, click "Mark Attendance" or "Add Record", select the employee and status, and save.',
    },
    {
      question: 'How can I filter attendance records?',
      answer: 'On the Attendance Logs page, use the filters at the top to search by date range, employee, or specific status (Present, Late, etc.).',
    },
    {
      question: 'How do I add a new employee?',
      answer: 'Navigate to the Employees directory, click the "Add Employee" button, and fill out their details.',
    },
    {
      question: 'How do I deactivate an employee?',
      answer: 'On the Employees directory, click the three-dot menu on their card and select "Deactivate". Their records will be preserved.',
    },
    {
      question: 'Can I export attendance logs?',
      answer: 'Yes! On the Attendance Logs page, click the "Export CSV" button to download a spreadsheet of the currently filtered records.',
    },
    {
      question: 'How do I change my admin password?',
      answer: 'Go to Settings > Security and enter your current password and new password.',
    },
  ];

  const resources = [
    {
      icon: Book,
      title: 'Documentation',
      description: 'Comprehensive guides on managing attendance',
      link: '#',
    },
    {
      icon: FileText,
      title: 'Tutorials',
      description: 'Step-by-step onboarding for administrators',
      link: '#',
    },
    {
      icon: MessageCircle,
      title: 'Community Forum',
      description: 'Connect with other HR professionals',
      link: '#',
    },
  ];

  const filteredFaq = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-emerald-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
              <p className="text-gray-600 mt-1">Find answers and get support for AttendEase</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for help..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-6 text-lg focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{resource.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                    <a href={resource.link} className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                      Learn more <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {filteredFaq.map((item, index) => (
              <details key={index} className="group">
                <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 hover:bg-gray-100 rounded-lg">
                  <span className="font-medium text-gray-900">{item.question}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="p-4 text-gray-600">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
          {filteredFaq.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No results found. Try different search terms.
            </div>
          )}
        </Card>

        {/* Contact Support */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
          <p className="text-gray-600 mb-6">
            Our support team is here to help you with any questions or issues.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-lg">
              <Mail className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                <p className="text-sm text-gray-600 mb-3">Get help via email within 24 hours</p>
                <a href="mailto:support@attendease.com" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                  support@attendease.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-teal-50 rounded-lg">
              <MessageCircle className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Live Chat</h3>
                <p className="text-sm text-gray-600 mb-3">Chat with our support team now</p>
                <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                  Start Chat
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Getting Started Guide */}
        <Card className="p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Getting Started</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Add Employees</h3>
                <p className="text-gray-600">Navigate to the Employees directory and add your team members to the system.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Log Daily Attendance</h3>
                <p className="text-gray-600">Use the Dashboard or Attendance Logs page to mark staff as Present, Late, or Absent.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Analyze Workforce Patterns</h3>
                <p className="text-gray-600">Visit the Analytics page to see attendance rates, department breakdown, and leave statistics.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Export Data</h3>
                <p className="text-gray-600">Download CSV reports of attendance records for payroll or HR purposes.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
