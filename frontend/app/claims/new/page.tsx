"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, FileText, CheckCircle, XCircle, Check, X } from 'lucide-react';
import Logo from "../../../assets/cnss-logo.png";
export default function CNSSMedicalForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [sectionFiles, setSectionFiles] = useState({
    section1: [],
    section2: [],
    section3: [],
    section4: [],
    section5: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSectionFileChange = (section, e) => {
    if (e.target.files) {
      setSectionFiles(prev => ({
        ...prev,
        [section]: [...prev[section], ...Array.from(e.target.files)]
      }));
    }
  };

  const removeSectionFile = (section, index) => {
    setSectionFiles(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const FileUploadSection = ({ section, title }) => (
    <div className="mt-3 p-2 border border-gray-200 rounded bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-gray-700">{title}</span>
        <label className="cursor-pointer">
          <input
            type="file"
            multiple
            onChange={(e) => handleSectionFileChange(section, e)}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <Upload className="h-4 w-4 text-blue-500 hover:text-blue-700" />
        </label>
      </div>
      {sectionFiles[section].length > 0 && (
        <div className="space-y-1">
          {sectionFiles[section].map((file, index) => (
            <div key={index} className="flex justify-between items-center text-xs bg-white p-1 rounded border">
              <span className="truncate flex-1">{file.name}</span>
              <button
                type="button"
                onClick={() => removeSectionFile(section, index)}
                className="text-red-500 hover:text-red-700 ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const onSubmit = (data) => {
    setIsSubmitting(true);
    setTimeout(() => {
      console.log({ ...data, files: sectionFiles });
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="text-center border-b-2 border-black pb-2 mb-4">
        <div className="flex justify-between items-start mb-2">
          <div className="text-xs">
          
            <div>N° Dossier : _______________</div> 
            <div><img src="../../../assets/cnss-logo.png" alt="CNSS Logo" width={64} height={64} /></div> 
          </div>
          <div className="text-center">
            <div className="text-sm font-bold">مديرية التأمين الصحي الإجباري</div>
            <div className="text-sm font-bold">Direction de l'Assurance Maladie Obligatoire</div>
          </div>
          <div className="text-xs text-right">
            <div>Réf : 610-1-02</div>
            <div>Réf. ANAM : 1.2.01.01</div>
          </div>
        </div>
        
        <h1 className="text-lg font-bold mt-2">
          ورقة العلاجات المتعلقة بالمرض<br/>
          Feuille de Soins Maladie
        </h1>
        
        <div className="flex justify-center space-x-8 mt-2 text-xs">
          <label className="flex items-center">
            <input type="checkbox" className="mr-1" />
            موافقة مسبقة * Entente préalable *
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-1" />
            تنفيذ * Exécution *
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Section 1: Partie réservée à l'assuré(e) */}
        <div className="border-2 border-black">
          <div className="bg-gray-100 p-2 text-center font-bold text-sm border-b border-black">
            Partie réservée à l'assuré(e) خاص بالمؤمن له(لها)
          </div>
          <div className="p-3 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium">Nom et prénom : الاسم العائلي والشخصي</label>
                <div className="border-b border-black mt-1">
                  <input
                    type="text"
                    className="w-full text-xs outline-none"
                    {...register("fullName", { required: true })}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium">N° Immatriculation : رقم التسجيل</label>
                <div className="flex space-x-1 mt-1">
                  {[...Array(10)].map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      className="w-6 h-6 border border-black text-center text-xs"
                      {...register(`registrationNumber.${i}`)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium">N° CIN : رقم بطاقة التعريف الوطنية</label>
                <div className="flex space-x-1 mt-1">
                  {[...Array(9)].map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      className="w-6 h-6 border border-black text-center text-xs"
                      {...register(`cinNumber.${i}`)}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium">Lien de parenté du bénéficiaire avec l'assuré(e) *</label>
                <div className="text-xs font-medium">علاقة القرابة بين المستفيد والمؤمن له(لها) *</div>
                <div className="flex space-x-4 mt-1">
                  <label className="flex items-center text-xs">
                    <input type="radio" value="Conjoint" {...register("relationship")} className="mr-1" />
                    Conjoint زوج
                  </label>
                  <label className="flex items-center text-xs">
                    <input type="radio" value="Enfant" {...register("relationship")} className="mr-1" />
                    Enfant ابن
                  </label>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium">Adresse : العنوان</label>
                <div className="border-b border-black mt-1">
                  <input
                    type="text"
                    className="w-full text-xs outline-none"
                    {...register("address")}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium">Montant des frais : مبلغ المصاريف</label>
                <div className="flex items-center">
                  <div className="border-b border-black flex-1">
                    <input
                      type="text"
                      className="w-full text-xs outline-none"
                      {...register("amount")}
                    />
                  </div>
                  <span className="text-xs ml-2">درهم Dhs</span>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium">Nombre de pièces jointes : عدد الوثائق المرفقة</label>
                <div className="border-b border-black mt-1">
                  <input
                    type="text"
                    className="w-full text-xs outline-none"
                    {...register("attachmentCount")}
                  />
                </div>
              </div>
            </div>

            <FileUploadSection 
              section="section1" 
              title="Documents - Partie assuré(e)" 
            />
          </div>
        </div>

        {/* Section 2: Bénéficiaire de soins */}
        <div className="border-2 border-black">
          <div className="bg-gray-100 p-2 text-center font-bold text-sm border-b border-black">
            Bénéficiaire de soins المستفيد من العلاجات
          </div>
          <div className="p-3 space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium">Nom et prénom : الاسم العائلي والشخصي</label>
                <div className="border-b border-black mt-1">
                  <input
                    type="text"
                    className="w-full text-xs outline-none"
                    {...register("beneficiaryName")}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium">Date de naissance : تاريخ الازدياد</label>
                <div className="flex space-x-1 mt-1">
                  <input type="text" maxLength={2} placeholder="JJ" className="w-8 h-6 border border-black text-center text-xs" {...register("birthDay")} />
                  <input type="text" maxLength={2} placeholder="MM" className="w-8 h-6 border border-black text-center text-xs" {...register("birthMonth")} />
                  <input type="text" maxLength={4} placeholder="AAAA" className="w-12 h-6 border border-black text-center text-xs" {...register("birthYear")} />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium">Sexe* : الجنس* :</label>
                <div className="flex space-x-4 mt-1">
                  <label className="flex items-center text-xs">
                    <input type="radio" value="M" {...register("gender")} className="mr-1" />
                    M ذكر
                  </label>
                  <label className="flex items-center text-xs">
                    <input type="radio" value="F" {...register("gender")} className="mr-1" />
                    F أنثى
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium">N° CIN: رقم بطاقة التعريف الوطنية:</label>
                <div className="flex space-x-1 mt-1">
                  {[...Array(9)].map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      className="w-6 h-6 border border-black text-center text-xs"
                      {...register(`beneficiaryCin.${i}`)}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium">INPE et code à barres ** الرقم المشفر الرقم الوطني الاستدلالي</label>
                <div className="flex space-x-1 mt-1">
                  {[...Array(10)].map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      className="w-6 h-6 border border-black text-center text-xs"
                      {...register(`inpeCode.${i}`)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <FileUploadSection 
              section="section2" 
              title="Documents - Bénéficiaire" 
            />
          </div>
        </div>

        {/* Section 3: Déclaration du médecin traitant */}
        <div className="border-2 border-black">
          <div className="bg-gray-100 p-2 text-center font-bold text-sm border-b border-black">
            Déclaration du médecin traitant تصريح الطبيب المعالج
          </div>
          <div className="p-3 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium">Médecin traitant الطبيب المعالج</label>
                <div className="flex space-x-1 mt-1">
                  {[...Array(10)].map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      className="w-6 h-6 border border-black text-center text-xs"
                      {...register(`doctorInpe.${i}`)}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium">Etablissement de soins المؤسسة العلاجية</label>
                <div className="flex space-x-1 mt-1">
                  {[...Array(10)].map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      className="w-6 h-6 border border-black text-center text-xs"
                      {...register(`facilityInpe.${i}`)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium">Type de soins نوع العلاجات</label>
              <div className="grid grid-cols-4 gap-2 mt-1">
                <label className="flex items-center text-xs">
                  <input type="checkbox" value="Maladie" {...register("careType")} className="mr-1" />
                  Maladie* مرض
                </label>
                <label className="flex items-center text-xs">
                  <input type="checkbox" value="Maternité" {...register("careType")} className="mr-1" />
                  Maternité* أمومة*
                </label>
                <label className="flex items-center text-xs">
                  <input type="checkbox" value="Hospitalisation" {...register("careType")} className="mr-1" />
                  Hospitalisation* استشفاء*
                </label>
                <label className="flex items-center text-xs">
                  <input type="checkbox" value="Accident" {...register("careType")} className="mr-1" />
                  Accident* حادثة*
                </label>
              </div>
            </div>

            <FileUploadSection 
              section="section3" 
              title="Documents - Médecin traitant" 
            />
          </div>
        </div>

        {/* Section 4: Description des actes effectués */}
        <div className="border-2 border-black">
          <div className="bg-gray-100 p-2 text-center font-bold text-sm border-b border-black">
            Description des actes effectués وصف العمليات المجراة
          </div>
          <div className="p-3">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-black">
                  <th className="border-r border-black p-1 text-center">تاريخ العمليات<br/>Date des actes</th>
                  <th className="border-r border-black p-1 text-center">رمز العمليات<br/>Code des actes</th>
                  <th className="border-r border-black p-1 text-center">معامل العمليات<br/>Lettre clé+<br/>cotation NGAP</th>
                  <th className="border-r border-black p-1 text-center">CIM-10</th>
                  <th className="border-r border-black p-1 text-center">المبلغ المفوتر<br/>Montant facturé</th>
                  <th className="p-1 text-center">توقيع وطابع الطبيب المعالج<br/>Signature et cachet du Médecin traitant</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(3)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-300">
                    <td className="border-r border-black p-1">
                      <input type="text" className="w-full text-xs outline-none" {...register(`actes.${i}.date`)} />
                    </td>
                    <td className="border-r border-black p-1">
                      <input type="text" className="w-full text-xs outline-none" {...register(`actes.${i}.code`)} />
                    </td>
                    <td className="border-r border-black p-1">
                      <input type="text" className="w-full text-xs outline-none" {...register(`actes.${i}.cotation`)} />
                    </td>
                    <td className="border-r border-black p-1">
                      <input type="text" className="w-full text-xs outline-none" {...register(`actes.${i}.cim10`)} />
                    </td>
                    <td className="border-r border-black p-1">
                      <input type="text" className="w-full text-xs outline-none" {...register(`actes.${i}.montant`)} />
                    </td>
                    <td className="p-1">
                      <div className="h-8 border border-gray-300"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="mt-2 text-xs">
              <div>INPE et code à Barres</div>
              <div className="flex space-x-1 mt-1">
                {[...Array(10)].map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    className="w-6 h-6 border border-black text-center text-xs"
                    {...register(`doctor1Inpe.${i}`)}
                  />
                ))}
              </div>
            </div>
            
            <FileUploadSection 
              section="section4" 
              title="Documents - Actes médicaux" 
            />
          </div>
        </div>

        {/* Section 5: Déclarations */}
        <div className="border-2 border-black">
          <div className="p-3 space-y-4">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <div className="text-xs">
                  <p className="font-medium">J'atteste sur l'honneur l'exactitude des renseignements portés ci-avant.</p>
                  <p>اشهد بصحة كل ما ذكر أعلاه</p>
                </div>
                
                <div>
                  <label className="text-xs font-medium">Fait à : ب:</label>
                  <div className="border-b border-black mt-1">
                    <input type="text" className="w-full text-xs outline-none" {...register("declarationPlace1")} />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-medium">Le : في:</label>
                  <div className="flex space-x-1 mt-1">
                    <input type="text" maxLength={2} placeholder="JJ" className="w-8 h-6 border border-black text-center text-xs" {...register("declarationDay1")} />
                    <input type="text" maxLength={2} placeholder="MM" className="w-8 h-6 border border-black text-center text-xs" {...register("declarationMonth1")} />
                    <input type="text" maxLength={4} placeholder="AAAA" className="w-12 h-6 border border-black text-center text-xs" {...register("declarationYear1")} />
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-xs font-medium">Signature de l'assuré(e)</div>
                  <div className="text-xs">توقيع المؤمن له</div>
                  <div className="h-16 border border-black mt-1"></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs">
                  <p className="font-medium">Je déclare les informations ci-dessus sincères et véritables.</p>
                  <p>أصرح بمصداقية وصحة المعلومات المذكورة أعلاه</p>
                </div>
                
                <div>
                  <label className="text-xs font-medium">Fait à : ب:</label>
                  <div className="border-b border-black mt-1">
                    <input type="text" className="w-full text-xs outline-none" {...register("declarationPlace2")} />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-medium">Le : في:</label>
                  <div className="flex space-x-1 mt-1">
                    <input type="text" maxLength={2} placeholder="JJ" className="w-8 h-6 border border-black text-center text-xs" {...register("declarationDay2")} />
                    <input type="text" maxLength={2} placeholder="MM" className="w-8 h-6 border border-black text-center text-xs" {...register("declarationMonth2")} />
                    <input type="text" maxLength={4} placeholder="AAAA" className="w-12 h-6 border border-black text-center text-xs" {...register("declarationYear2")} />
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-xs font-medium">Cachet et Signature du Médecin traitant ou de l'Etablissement de soins</div>
                  <div className="text-xs">طابع وتوقيع الطبيب المعالج أو المؤسسة الصحية</div>
                  <div className="h-16 border border-black mt-1"></div>
                </div>
              </div>
            </div>

            <FileUploadSection 
              section="section5" 
              title="Documents - Déclarations et signatures" 
            />
          </div>
        </div>

        {/* Footer Instructions */}
        <div className="text-xs bg-gray-50 p-3 border">
          <div className="text-center font-bold mb-2">Instructions à suivre تعليمات يجب إتباعها</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p>- * Cocher la mention utile pour chaque case</p>
              <p>- ** Accoler l'étiquette portant l'Identifiant National des Professionnels de santé et des Etablissements de soins, ainsi que le code à barres.</p>
            </div>
            <div className="space-y-1 text-right" dir="rtl">
              <p>* أطب الخانة المناسبة -</p>
              <p>تقديم ورقة العلاجات بالنسبة لكل مرض ولكل حدث. -</p>
            </div>
          </div>
        </div>

        {/* Footer Contact */}
        <div className="text-xs text-center border-t pt-2">
          <p>دار المؤمن–ساحة داكار–الدار البيضاء المحطة-الهاتف05 22 54 86 07، مركز الاتصال 09 82 00 72 00، الفاكس 05 22 54 86 25/26/27/28</p>
          <p>Maison de l'assuré _ Place de DAKAR _ Casablanca BP: 2186 Casa Gare Téléphone : 0522 548 607, Centre d'appels AMO : 09 8200 7200, Fax : 0522 548 625/ 26/ 27/ 28</p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-3 rounded-md text-white font-medium ${
              isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Envoi en cours...' : 'Soumettre le formulaire'}
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {submitSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Formulaire soumis avec succès!</h3>
            <p className="mb-4">Votre demande de remboursement a été enregistrée avec tous les documents joints.</p>
            <button
              onClick={() => setSubmitSuccess(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}