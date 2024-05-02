import json
import os
import openai

openai.api_key = ''


def translate_localizable_strings(input_file, language):
    def translate(text, language):
        prompt = f"""Translate the following text into {language}:
{text}
Your response should only include the translated content without quotation marks. For example, the translation of 'Hello' should be returned as 'Hola' without quotes."""
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo-1106",
            messages=[
                {"role": "system", "content": prompt}
            ],
            max_tokens=4096,
            temperature=0.7,
            stop=None
        )
        translated_text = response.choices[0].message['content'].strip()
        return translated_text

    output_file = f'Localizable_{language}.strings'

    if not os.path.exists(output_file):
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write('')

    with open(input_file, 'r', encoding='utf-8') as input_f:
        with open(output_file, 'w', encoding='utf-8') as output_f:
            for line in input_f:
                line = line.strip()
                if '=' in line and '"' in line:
                    key, value = line.split('=', 1)
                    key = key.strip()
                    value = value.strip().strip('"').strip(';')

                    if value.endswith('"'):
                        value = value[:-1]

                    translated_value = translate(value, language)

                    if line.endswith('"'):
                        translated_value += '"'

                    output_f.write(f'{key} = "{translated_value}";\n')
                else:
                    output_f.write(f'{line}\n')


input_file = "Localizable.strings"
languages = [
    # "es",
    "kr",
]

for language in languages:
    translate_localizable_strings(input_file, language)
