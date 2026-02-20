FROM python:3.12-slim
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install -i https://mirror-pypi.runflare.com/simple --upgrade setuptools wheel pip && \
pip install -i https://mirror-pypi.runflare.com/simple -r requirements.txt

# RUN pip install -i https://mirror-pypi.runflare.com/simple -r requirements.txt
# RUN pip install --no-cache-dir -r requirements.txt

COPY . .
ENV PYTHONPATH=/app
EXPOSE 8000
