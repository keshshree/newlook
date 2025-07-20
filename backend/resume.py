from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

def generate_resume_pdf(data):
    pdf_buffer = io.BytesIO()
    doc = SimpleDocTemplate(pdf_buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    
    # Resume content
    content = []
    
    # Personal Information
    content.append(Paragraph(data['fullName'], styles['h1']))
    content.append(Paragraph(data['email'], styles['body']))
    content.append(Paragraph(data['phoneNumber'], styles['body']))
    content.append(Paragraph(data['address'], styles['body']))
    content.append(Spacer(1, 12))
    
    # Summary
    content.append(Paragraph("Summary", styles['h2']))
    content.append(Paragraph(data['summary'], styles['body']))
    content.append(Spacer(1, 12))
    
    # Work Experience
    content.append(Paragraph("Work Experience", styles['h2']))
    for exp in data['experience']:
        content.append(Paragraph(f"{exp['jobTitle']} at {exp['company']}", styles['h3']))
        content.append(Paragraph(f"{exp['startDate']} - {exp['endDate']}", styles['body']))
        content.append(Paragraph(exp['description'], styles['body']))
        content.append(Spacer(1, 12))
        
    # Education
    content.append(Paragraph("Education", styles['h2']))
    for edu in data['education']:
        content.append(Paragraph(f"{edu['degree']} from {edu['school']}", styles['h3']))
        content.append(Paragraph(f"{edu['startDate']} - {edu['endDate']}", styles['body']))
        content.append(Spacer(1, 12))
        
    # Skills
    content.append(Paragraph("Skills", styles['h2']))
    content.append(Paragraph(data['skills'], styles['body']))
    
    doc.build(content)
    pdf_buffer.seek(0)
    return pdf_buffer
