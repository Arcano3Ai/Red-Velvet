import re
import random

random.seed(42) # For reproducible results

html_file = 'index.html'
with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

nacionalidades = ["Mexicana", "Colombiana", "Argentina", "Española", "Venezolana", "Brasileña"]
medidas = ["90-60-90", "88-58-92", "92-62-94", "85-55-88", "95-65-95", "89-60-91"]
idiomas = ["Español, Inglés", "Español", "Español, Francés", "Español, Inglés, Italiano"]

def replace_featured(match):
    tarifa = match.group(1)
    nac = random.choice(nacionalidades)
    med = random.choice(medidas)
    idi = random.choice(idiomas)
    
    return f'''<div class="profile-details">
                                <p><strong>Tarifa:</strong> {tarifa}</p>
                                <p><strong>Nac:</strong> {nac} | <strong>Medidas:</strong> {med}</p>
                                <p><strong>Idiomas:</strong> {idi}</p>
                                <p><strong>Servicios:</strong> GFE, Cenas, Viajes</p>
                            </div>'''

# Replace featured
content = re.sub(r'<div class="profile-details">\s*<p><strong>Tarifa:</strong> (.*?)</p>\s*<p><strong>Servicios:</strong> (.*?)</p>\s*</div>', replace_featured, content)


def replace_elite(match):
    name = match.group(1)
    loc = match.group(2)
    nac = random.choice(nacionalidades)
    med = random.choice(medidas)
    return f'''<div class="elite-card-overlay">
                            <h3>{name}</h3>
                            <p>{loc}</p>
                            <div class="elite-details" style="margin-top: 10px; font-size: 0.8rem; color: #ccc;">
                                <p><strong>Nac:</strong> {nac} | <strong>Medidas:</strong> {med}</p>
                                <p><strong>Tarifa:</strong> $8,000 MXN / hr</p>
                            </div>
                        </div>'''

# Replace elite
content = re.sub(r'<div class="elite-card-overlay">\s*<h3>(.*?)</h3>\s*<p>(.*?)</p>\s*</div>', replace_elite, content)

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Added more candidate data")
