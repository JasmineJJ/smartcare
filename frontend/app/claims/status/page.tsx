"use client";

// pages/claims/status.js - Claim Status Tracking Page
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../../components/Layout';
import { 
  Clock, CheckCircle, XCircle, Eye, Send, 
  FileText, Calendar, DollarSign, User,
  Stethoscope, Pill, Camera, RefreshCw
} from 'lucide-react';

const ClaimStatusPage = () => {
  const router = useRouter();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState(null);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/claims/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setClaims(data.claims);
      } else if (response.status === 401) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'draft': { 
        icon: FileText, 
        color: 'gray', 
        text: 'مسودة', 
        textEn: 'Draft',
        description: 'الطلب قيد الإعداد'
      },
      'submitted': { 
        icon: Send, 
        color: 'blue', 
        text: 'مُرسل', 
        textEn: 'Submitted',
        description: 'تم إرسال الطلب بنجاح'
      },
      'under-review': { 
        icon: Eye, 
        color: 'yellow', 
        text: 'قيد المراجعة', 
        textEn: 'Under Review',
        description: 'الطلب قيد المراجعة من قبل الأطراف المختصة'
      },
      'pending-approval': { 
        icon: Clock, 
        color: 'orange', 
        text: 'في انتظار الموافقة', 
        textEn: 'Pending Approval',
        description: 'في انتظار موافقة جميع الأطراف المعنية'
      },
      'approved': { 
        icon: CheckCircle, 
        color: 'green', 
        text: 'مقبول', 
        textEn: 'Approved',
        description: 'تم قبول الطلب'
      },
      'in-processing': { 
        icon: RefreshCw, 
        color: 'blue', 
        text: 'قيد المعالجة', 
        textEn: 'In Processing',
        description: 'قيد المعالجة من قبل CNSS'
      },
      'completed': { 
        icon: CheckCircle, 
        color: 'green', 
        text: 'مكتمل', 
        textEn: 'Completed',
        description: 'تم التعويض بنجاح'
      },
      'rejected': { 
        icon: XCircle, 
        color: 'red', 
        text: 'مرفوض', 
        textEn: 'Rejected',
        description: 'تم رفض الطلب'
      }
    };
    return statusMap[status] || statusMap['draft'];
  };

  const getSectionStatusInfo = (status) => {
    const statusMap = {
      'pending': { color: 'yellow', text: 'في الانتظار' },
      'approved': { color: 'green', text: 'مقبول' },
      'rejected': { color: 'red', text: 'مرفوض' }
    };
    return statusMap[status] || statusMap['pending'];
  };

  const ClaimCard = ({ claim }) => {
    const statusInfo = getStatusInfo(claim.status);
    const StatusIcon = statusInfo.icon;

    return (
      <div 
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setSelectedClaim(claim)}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              الطلب رقم: {claim.id}
            </h3>
            <p className="text-sm text-gray-600">
              تاريخ الإنشاء: {new Date(claim.created_at).toLocaleDateString('ar-MA')}
            </p>
          </div>
          <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${statusInfo.color}-100 text-${statusInfo.color}-800`}>
            <StatusIcon className="w-4 h-4 mr-1" />
            {statusInfo.text}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">
              المبلغ: {claim.montant_frais} درهم
            </span>
          </div>
          <div className="flex items-center">
            <FileText className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">
              نوع العلاج: {claim.type_soins?.join(', ')}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {claim.sections && Object.entries(claim.sections).map(([key, section]) => {
              const sectionInfo = getSectionStatusInfo(section.status);
              return (
                <div 
                  key={key}
                  className={`w-3 h-3 rounded-full bg-${sectionInfo.color}-400`}
                  title={`${key}: ${sectionInfo.text}`}
                ></div>
              );
            })}
          </div>
          <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">
            عرض التفاصيل
          </button>
        </div>
      </div>
    );
  };

  const ClaimDetails = ({ claim }) => {
    const statusInfo = getStatusInfo(claim.status);
    const StatusIcon = statusInfo.icon;

    const sectionIcons = {
      doctor: Stethoscope,
      pharmacy: Pill,
      radiology: Camera,
      laboratory: FileText
    };

    const sectionNames = {
      doctor: 'الطبيب المعالج',
      pharmacy: 'الصيدلية',
      radiology: 'الأشعة والتصوير',
      laboratory: 'المختبر'
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">تفاصيل الطلب: {claim.id}</h2>
                <p className="text-teal-100">تتبع حالة طلب التعويض</p>
              </div>
              <button 
                onClick={() => setSelectedClaim(null)}
                className="text-white hover:text-gray-200"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Status Timeline */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">مراحل معالجة الطلب</h3>
              <div className="flex items-center justify-between">
                {[
                  { key: 'submitted', text: 'مُرسل' },
                  { key: 'under-review', text: 'قيد المراجعة' },
                  { key: 'approved', text: 'مقبول' },
                  { key: 'in-processing', text: 'قيد المعالجة' },
                  { key: 'completed', text: 'مكتمل' }
                ].map((step, index) => {
                  const isActive = claim.status === step.key;
                  const isPassed = ['submitted', 'under-review', 'approved'].indexOf(claim.status) >= ['submitted', 'under-review', 'approved'].indexOf(step.key);
                  
                  return (
                    <div key={step.key} className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isActive ? 'bg-teal-600 text-white' : 
                        isPassed ? 'bg-green-500 text-white' : 
                        'bg-gray-300 text-gray-600'
                      }`}>
                        {isPassed && !isActive ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <span className="text-xs mt-2 text-center">{step.text}</span>
                      {index < 4 && (
                        <div className={`h-1 w-16 mt-1 ${
                          isPassed ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current Status */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <StatusIcon className={`w-6 h-6 text-${statusInfo.color}-600 mr-3`} />
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{statusInfo.text}</h4>
                    <p className="text-sm text-gray-600">{statusInfo.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">آخر تحديث</p>
                  <p className="text-sm font-medium">{new Date(claim.updated_at).toLocaleDateString('ar-MA')}</p>
                </div>
              </div>
            </div>

            {/* Claim Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">معلومات الطلب</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">رقم الطلب:</span>
                    <span className="font-mono">{claim.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">المبلغ المطلوب:</span>
                    <span className="font-medium">{claim.montant_frais} درهم</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">نوع العلاج:</span>
                    <span>{claim.type_soins?.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">تاريخ الإنشاء:</span>
                    <span>{new Date(claim.created_at).toLocaleDateString('ar-MA')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">معلومات المستفيد</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">الاسم:</span>
                    <span>{claim.beneficiary_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">رقم الهوية:</span>
                    <span className="font-mono">{claim.beneficiary_cin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">علاقة القرابة:</span>
                    <span>{claim.lien_parente === 'conjoint' ? 'زوج/زوجة' : 'ابن/ابنة'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sections Status */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">حالة الموافقات من الأطراف المختصة</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {claim.sections && Object.entries(claim.sections).map(([key, section]) => {
                  const SectionIcon = sectionIcons[key];
                  const sectionStatus = getSectionStatusInfo(section.status);
                  
                  return (
                    <div key={key} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <SectionIcon className="w-5 h-5 text-gray-600 mr-2" />
                          <span className="font-medium">{sectionNames[key]}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${sectionStatus.color}-100 text-${sectionStatus.color}-800`}>
                          {sectionStatus.text}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">المستندات:</span>
                          <span>{section.documents?.length || 0} ملف</span>
                        </div>
                        
                        {section.comment && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                            <span className="font-medium text-gray-700">تعليق: </span>
                            <span className="text-gray-600">{section.comment}</span>
                          </div>
                        )}
                        
                        {section.approved_at && (
                          <div className="text-xs text-gray-500">
                            تمت الموافقة في: {new Date(section.approved_at).toLocaleDateString('ar-MA')}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Documents */}
            {claim.documents && claim.documents.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">المستندات المرفقة</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {claim.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-700">{doc.name}</span>
                      </div>
                      <button className="text-teal-600 hover:text-teal-700 text-xs">
                        عرض
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <button
                onClick={() => setSelectedClaim(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                إغلاق
              </button>
              {claim.status === 'completed' && (
                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                  تحميل إشعار التعويض
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6 rounded-lg mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">تتبع طلبات التعويض</h1>
              <p className="text-teal-100">Suivi des demandes de remboursement</p>
            </div>
            <button
              onClick={() => router.push('/claims/new')}
              className="bg-white text-teal-600 px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center"
            >
              <FileText className="w-4 h-4 mr-2" />
              طلب جديد
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'إجمالي الطلبات', count: claims.length, color: 'blue', icon: FileText },
            { title: 'قيد المراجعة', count: claims.filter(c => c.status === 'under-review').length, color: 'yellow', icon: Clock },
            { title: 'مقبولة', count: claims.filter(c => c.status === 'approved' || c.status === 'completed').length, color: 'green', icon: CheckCircle },
            { title: 'مرفوضة', count: claims.filter(c => c.status === 'rejected').length, color: 'red', icon: XCircle }
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                    <IconComponent className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Claims List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">طلباتي</h2>
          
          {claims.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات</h3>
              <p className="text-gray-600 mb-4">لم تقم بإنشاء أي طلب تعويض بعد</p>
              <button
                onClick={() => router.push('/claims/new')}
                className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700"
              >
                إنشاء طلب جديد
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {claims.map(claim => (
                <ClaimCard key={claim.id} claim={claim} />
              ))}
            </div>
          )}
        </div>

        {/* Claim Details Modal */}
        {selectedClaim && <ClaimDetails claim={selectedClaim} />}
      </div>
    </Layout>
  );
};

export default ClaimStatusPage;