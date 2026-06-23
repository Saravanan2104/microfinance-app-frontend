import re

with open('src/branch/MembersTab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove form states and submit
content = re.sub(r'const \[showAddForm, setShowAddForm\] = useState\(false\);.*?const handleAddMemberSubmit = \(e\) => \{.*?setKycNumber\(""\);\s*setShowAddForm\(false\);\s*\};', '', content, flags=re.DOTALL)

# 2. Remove the register button
content = re.sub(r'<button[^>]*onClick=\{\(\) => \{\s*setShowAddForm\(!showAddForm\);\s*setSelectedMember\(null\);\s*\}\}[^>]*>.*?<\/button>', '', content, flags=re.DOTALL)

# 3. Remove conditional wrapper around search bar
content = content.replace('{!showAddForm && (', '')
content = content.replace('      )}\n\n      <div className="row g-4">', '      \n\n      <div className="row g-4">')

# 4. Remove the form UI
content = re.sub(r'\{showAddForm \? \(\s*/\* Add Member Form Card \*/.*?\)\s*:\s*\(', '', content, flags=re.DOTALL)

# 5. Remove the closing brace of the form conditional
content = content.replace('          )}\n\n        </div>', '          \n\n        </div>')

# 6. Remove setShowAddForm(false) in click handlers
content = content.replace('setShowAddForm(false);', '')

# Remove selectedMember && !showAddForm
content = content.replace('{selectedMember && !showAddForm && (', '{selectedMember && (')

with open('src/branch/MembersTab.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
