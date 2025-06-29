"use client";

// pages/auth/register.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../../assets/cnss-logo.png';
import api from "../api";

interface RegistrationData {
  // Account fields
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  
  // Personal Information (Assuré - Insurance Holder)
  first_name: string;
  last_name: string;
  first_name_ar: string;
  last_name_ar: string;
  numero_immatriculation: string;
  cin: string;
  sexe: string;
  date_naissance: string;
  adresse: string;
  
  // Beneficiary Information (for family members)
  beneficiaire_first_name: string;
  beneficiaire_last_name: string;
  beneficiaire_first_name_ar: string;
  beneficiaire_last_name_ar: string;
  beneficiaire_cin: string;
  beneficiaire_date_naissance: string;
  beneficiaire_sexe: string;
  lien_parente: string;
}

interface Beneficiary {
  first_name: string;
  last_name: string;
  first_name_ar: string;
  last_name_ar: string;
  cin: string;
  date_naissance: string;
  sexe: string;
  lien_parente: string;
}

const blankBeneficiary = (): Beneficiary => ({
  first_name: "",
  last_name: "",
  first_name_ar: "",
  last_name_ar: "",
  cin: "",
  date_naissance: "",
  sexe: "",
  lien_parente: "",
});

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationData>({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    first_name_ar: '',
    last_name_ar: '',
    numero_immatriculation: '',
    cin: '',
    sexe: '',
    date_naissance: '',
    adresse: '',
    beneficiaire_first_name: '',
    beneficiaire_last_name: '',
    beneficiaire_first_name_ar: '',
    beneficiaire_last_name_ar: '',
    beneficiaire_cin: '',
    beneficiaire_date_naissance: '',
    beneficiaire_sexe: '',
    lien_parente: '',
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    blankBeneficiary(), // start with one beneficiary section by default
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // remove blank beneficiary rows the user didn't fill
      const validBeneficiaries = beneficiaries.filter(
        b => b.first_name.trim() !== '' || b.last_name.trim() !== ''
      );

      const payload = { ...formData, beneficiaries: validBeneficiaries };
      delete payload.password_confirm;

      const { data } = await api.post('/auth/register/', payload);

      localStorage.setItem('access_token', data.tokens.access);
      localStorage.setItem('refresh_token', data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (error: any) {
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: 'Erreur de connexion au serveur' });
      }
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleBenef = (index: number, field: string, value: string) => {
    setBeneficiaries(prev =>
      prev.map((b, i) =>
        i === index ? { ...b, [field]: value } : b
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* CNSS Header - Mimicking the original form */}
        <div className="bg-white border-2 border-black mb-6">
          <div className="grid grid-cols-3 border-b-2 border-black">
            {/* CNSS Logo Section */}
            <div className="border-r-2 border-black p-4 flex items-center justify-center">
              <div className="text-center">
                <Image
                  src={Logo}
                  alt="CNSS Logo"
                  width={80}
                  height={80}
                  className="mx-auto mb-2"
                  priority
                />
                <div className="text-xs text-blue-600 font-semibold">الضمان الاجتماعي</div>
              </div>
            </div>

            {/* Title Section */}
            <div className="border-r-2 border-black p-4 text-center">
              <h1 className="text-lg font-bold mb-2" dir="rtl">
                ورقة التسجيل في المنصة الرقمية
              </h1>
              <h1 className="text-lg font-bold mb-4">
                Inscription Plateforme Numérique
              </h1>
              
              {/* Authorization Type Boxes */}
              <div className="flex justify-center space-x-4">
                <div className="border-2 border-black px-4 py-2">
                  <span className="text-sm">* موافقة مسبقة</span><br/>
                  <span className="text-sm">Entente préalable *</span>
                </div>
                <div className="border-2 border-black px-4 py-2 bg-blue-50">
                  <span className="text-sm">* تنفيذ</span><br/>
                  <span className="text-sm">Exécution *</span>
                </div>
              </div>
            </div>

            {/* Institution Section */}
            <div className="p-4 text-center">
              <div className="text-sm font-bold" dir="rtl">
                مديرية التأمين الصحي الإجباري
              </div>
              <div className="text-sm font-bold italic">
                Direction de l'Assurance Maladie Obligatoire
              </div>
              <div className="text-xs mt-2">
                Réf : 610-1-02
              </div>
              <div className="text-xs" dir="rtl">
                مرجع رقم ANAM : 1.2.01.01
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white border-2 border-black mb-6 p-4">
          <div className="flex justify-between items-center">
            <div className={`flex-1 text-center py-2 ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'} border border-black`}>
              <span className="text-sm font-bold">1. Compte / الحساب</span>
            </div>
            <div className={`flex-1 text-center py-2 ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'} border border-black`}>
              <span className="text-sm font-bold">2. Assuré(e) / المؤمن له</span>
            </div>
            <div className={`flex-1 text-center py-2 ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'} border border-black`}>
              <span className="text-sm font-bold">3. Bénéficiaire / المستفيد</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border-2 border-black">
          
          {/* Step 1: Account Information */}
          {currentStep === 1 && (
            <div className="p-6">
              <div className="border-b-2 border-black pb-4 mb-6">
                <h2 className="text-lg font-bold">
                  <span dir="rtl">معلومات الحساب</span> / Informations de compte
                </h2>
              </div>

              {errors.general && (
                <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 mb-4">
                  {errors.general}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2">
                    <span dir="rtl">اسم المستخدم</span> / Nom d'utilisateur *
                  </label>
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:bg-blue-50"
                    style={{ fontFamily: 'monospace' }}
                  />
                  {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    <span dir="rtl">البريد الإلكتروني</span> / Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:bg-blue-50"
                    style={{ fontFamily: 'monospace' }}
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    <span dir="rtl">كلمة المرور</span> / Mot de passe *
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:bg-blue-50"
                    style={{ fontFamily: 'monospace' }}
                  />
                  {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    <span dir="rtl">تأكيد كلمة المرور</span> / Confirmer mot de passe *
                  </label>
                  <input
                    type="password"
                    name="password_confirm"
                    required
                    value={formData.password_confirm}
                    onChange={handleChange}
                    className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:bg-blue-50"
                    style={{ fontFamily: 'monospace' }}
                  />
                  {errors.password_confirm && <p className="text-red-600 text-sm mt-1">{errors.password_confirm}</p>}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 text-white px-6 py-2 border-2 border-black hover:bg-blue-700 font-bold"
                >
                  Suivant / التالي →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Insurance Holder Information */}
          {currentStep === 2 && (
            <div className="p-6">
              <div className="border-b-2 border-black pb-4 mb-6">
                <h2 className="text-lg font-bold">
                  <span dir="rtl">( لها ) له بالمؤمن خاص</span> / Partie réservée à l'assuré(e)
                </h2>
              </div>

              <div className="space-y-6">
                {/* Names */}
                <div>
                  <label className="block text-sm font-bold mb-2">
                    <span dir="rtl">الاسم العائلي والشخصي</span> : Nom et prénom :
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="last_name"
                      placeholder="Nom / اسم العائلة"
                      required
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:bg-blue-50"
                      style={{ fontFamily: 'monospace' }}
                    />
                    <input
                      type="text"
                      name="first_name"
                      placeholder="Prénom / الاسم الشخصي"
                      required
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:bg-blue-50"
                      style={{ fontFamily: 'monospace' }}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <input
                      type="text"
                      name="last_name_ar"
                      placeholder="الاسم العائلي بالعربية"
                      value={formData.last_name_ar}
                      onChange={handleChange}
                      className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:bg-blue-50"
                      dir="rtl"
                      style={{ fontFamily: 'Arial' }}
                    />
                    <input
                      type="text"
                      name="first_name_ar"
                      placeholder="الاسم الشخصي بالعربية"
                      value={formData.first_name_ar}
                      onChange={handleChange}
                      className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:bg-blue-50"
                      dir="rtl"
                      style={{ fontFamily: 'Arial' }}
                    />
                  </div>
                </div>

                {/* Registration Number */}
                <div>
                  <label className="block text-sm font-bold mb-2">
                    <span dir="rtl">رقم التسجيل</span> : N° Immatriculation :
                  </label>
                  <div className="flex space-x-1">
                    {Array.from({ length: 10 }, (_, i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        className="w-8 h-8 border-2 border-black text-center focus:outline-none focus:bg-blue-50"
                        style={{ fontFamily: 'monospace' }}
                        onChange={(e) => {
                          const value = e.target.value;
                          const currentImmat = formData.numero_immatriculation.split('');
                          currentImmat[i] = value;
                          setFormData(prev => ({
                            ...prev,
                            numero_immatriculation: currentImmat.join('').slice(0, 10)
                          }));
                          
                          // Auto-focus next input
                          if (value && e.target.nextElementSibling) {
                            (e.target.nextElementSibling as HTMLInputElement).focus();
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* CIN */}
                <div>
                  <label className="block text-sm font-bold mb-2">
                    <span dir="rtl">رقم بطاقة التعريف الوطنية</span> : N° CIN :
                  </label>
                  <div className="flex space-x-1">
                    {Array.from({ length: 9 }, (_, i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        className="w-8 h-8 border-2 border-black text-center focus:outline-none focus:bg-blue-50"
                        style={{ fontFamily: 'monospace' }}
                        onChange={(e) => {
                          const value = e.target.value;
                          const currentCin = formData.cin.split('');
                          currentCin[i] = value;
                          setFormData(prev => ({
                            ...prev,
                            cin: currentCin.join('').slice(0, 9)
                          }));
                          
                          if (value && e.target.nextElementSibling) {
                            (e.target.nextElementSibling as HTMLInputElement).focus();
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-bold mb-2">
                    <span dir="rtl">العنوان</span> : Adresse :
                  </label>
                  <textarea
                    name="adresse"
                    required
                    value={formData.adresse}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:bg-blue-50"
                    style={{ fontFamily: 'monospace' }}
                  />
                </div>

                {/* Birth Date and Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2">
                      <span dir="rtl">تاريخ الازدياد</span> : Date de naissance :
                    </label>
                    <input
                      type="date"
                      name="date_naissance"
                      required
                      value={formData.date_naissance}
                      onChange={handleChange}
                      className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:bg-blue-50"
                      style={{ fontFamily: 'monospace' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">
                      <span dir="rtl">الجنس</span> : Sexe* :
                    </label>
                    <div className="flex space-x-6">
                      <label className="flex items-center">
                        <span className="text-sm font-bold mr-2">M</span>
                        <input
                          type="radio"
                          name="sexe"
                          value="M"
                          checked={formData.sexe === 'M'}
                          onChange={handleChange}
                          className="mr-2 scale-150"
                        />
                        <span className="text-sm" dir="rtl">ذكر</span>
                      </label>
                      <label className="flex items-center">
                        <span className="text-sm font-bold mr-2">F</span>
                        <input
                          type="radio"
                          name="sexe"
                          value="F"
                          checked={formData.sexe === 'F'}
                          onChange={handleChange}
                          className="mr-2 scale-150"
                        />
                        <span className="text-sm" dir="rtl">أنثى</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-600 text-white px-6 py-2 border-2 border-black hover:bg-gray-700 font-bold"
                >
                  ← Précédent / السابق
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 text-white px-6 py-2 border-2 border-black hover:bg-blue-700 font-bold"
                >
                  Suivant / التالي →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Beneficiary Information */}
          {currentStep === 3 && (
            <div className="p-6">
              <div className="border-b-2 border-black pb-4 mb-6">
                <h2 className="text-lg font-bold">
                  <span dir="rtl">المستفيد من العلاجات</span> / Bénéficiaire de soins
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  <span dir="rtl">يمكنك إضافة أفراد عائلتك كمستفيدين</span> / 
                  Vous pouvez ajouter les membres de votre famille comme bénéficiaires
                </p>
              </div>

              {/* Add Beneficiary Button (visible in step 3 header) */}
              <div className="flex justify-end pr-6 pt-4">
                <button
                  type="button"
                  onClick={() => setBeneficiaries((prev) => [...prev, blankBeneficiary()])}
                  className="bg-blue-600 text-white px-4 py-2 border-2 border-black hover:bg-blue-700 font-bold"
                >
                  + Ajouter un bénéficiaire
                </button>
              </div>

              <div className="space-y-6">
                {beneficiaries.map((b, idx) => (
                  <div key={idx} className="border-2 border-dashed border-teal-600 p-4 rounded mb-6">
                    <h3 className="font-bold mb-4 text-teal-700">Bénéficiaire {idx + 1}</h3>

                    {/* Beneficiary Names */}
                    <div className="mb-4">
                      <label className="block text-sm font-bold mb-2">
                        <span dir="rtl">الاسم العائلي والشخصي</span> : Nom et prénom :
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="beneficiaire_last_name" value={b.last_name} onChange={(e)=>handleBenef(idx,'last_name',e.target.value)} placeholder="Nom du bénéficiaire" className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:bg-blue-50" />
                        <input type="text" name="beneficiaire_first_name" value={b.first_name} onChange={(e)=>handleBenef(idx,'first_name',e.target.value)} placeholder="Prénom du bénéficiaire" className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:bg-blue-50" />
                      </div>
                    </div>

                    {/* Relationship */}
                    <div className="mb-4">
                      <label className="block text-sm font-bold mb-2">
                        <span dir="rtl">علاقة القرابة</span> / Lien de parenté
                      </label>
                      <select name="lien_parente" value={b.lien_parente} onChange={(e)=>handleBenef(idx,'lien_parente',e.target.value)} className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:bg-blue-50">
                        <option value="">-- Sélectionner --</option>
                        <option value="conjoint">Conjoint</option>
                        <option value="enfant">Enfant</option>
                      </select>
                    </div>

                    {/* Birthdate & Gender */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <input type="date" name="beneficiaire_date_naissance" value={b.date_naissance} onChange={(e)=>handleBenef(idx,'date_naissance',e.target.value)} className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:bg-blue-50" />
                      <input type="text" name="beneficiaire_cin" value={b.cin} onChange={(e)=>handleBenef(idx,'cin',e.target.value)} placeholder="N° CIN" className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:bg-blue-50" />
                      <select name="beneficiaire_sexe" value={b.sexe} onChange={(e)=>handleBenef(idx,'sexe',e.target.value)} className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:bg-blue-50">
                        <option value="">Sexe</option>
                        <option value="M">M</option>
                        <option value="F">F</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-600 text-white px-6 py-2 border-2 border-black hover:bg-gray-700 font-bold"
                >
                  ← Précédent / السابق
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white px-6 py-2 border-2 border-black hover:bg-green-700 font-bold disabled:opacity-50"
                >
                  {loading ? 'Inscription...' : 'S\'inscrire / تسجيل'}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Déjà inscrit? {' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-800 font-bold">
              Se connecter / تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}